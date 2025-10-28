import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt } from '$lib/utils/utils';

// Allowed sorting fields
const ALLOWED_SORT_FIELDS = ['name', 'created_at', 'updated_at'];

// GET /api/clients
export const GET: RequestHandler = async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') || '1');
	let limit = parseInt(url.searchParams.get('limit') || '10');
	let sortField = url.searchParams.get('sort') || 'created_at';
	let sortOrder = (url.searchParams.get('order') as 'asc' | 'desc') || 'desc';

	// sanitize
	page = Math.max(page, 1);
	limit = Math.min(Math.max(limit, 1), 100);

	if (!ALLOWED_SORT_FIELDS.includes(sortField)) sortField = 'created_at';
	if (!['asc', 'desc'].includes(sortOrder)) sortOrder = 'desc';

	const offset = (page - 1) * limit;

	try {
		const clientsData = await prisma.clients.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			include: { projects: true }
		});

		const total = await prisma.clients.count();

		return json(
			serializeBigInt({
				clients: clientsData,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
				sort: { field: sortField, order: sortOrder }
			})
		);
	} catch (error) {
		console.error('Error fetching clients:', error);
		return json({ error: 'Failed to fetch clients' }, { status: 500 });
	}
};

// POST /api/clients
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		if (!data.name) return json({ error: 'name is required' }, { status: 400 });

		const newClient = await prisma.clients.create({
			data: {
				name: data.name,
				logo: data.logo ?? null
			}
		});

		return json(serializeBigInt(newClient), { status: 201 });
	} catch (error) {
		console.error('Error creating client:', error);
		return json({ error: 'Failed to create client' }, { status: 500 });
	}
};

// PUT /api/clients?id=123
export const PUT: RequestHandler = async ({ request, url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Client ID is required' }, { status: 400 });

	try {
		const data = await request.json();

		const updatedClient = await prisma.clients.update({
			where: { id: BigInt(idParam) },
			data: {
				name: data.name,
				logo: data.logo ?? null
			},
			include: { projects: true }
		});

		return json(serializeBigInt(updatedClient));
	} catch (error) {
		console.error(`Error updating client ${idParam}:`, error);
		return json({ error: `Failed to update client ${idParam}` }, { status: 500 });
	}
};

// DELETE /api/clients?id=123
export const DELETE: RequestHandler = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Client ID is required' }, { status: 400 });

	try {
		await prisma.clients.delete({ where: { id: BigInt(idParam) } });
		return json({ message: 'Client deleted successfully' });
	} catch (error) {
		console.error(`Error deleting client ${idParam}:`, error);
		return json({ error: `Failed to delete client ${idParam}` }, { status: 500 });
	}
};
