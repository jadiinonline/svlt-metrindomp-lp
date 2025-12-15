import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, toTitleCase, camelToSnakeSafe } from '$lib/utils/utils';

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
			include: {
				media: true,
				projects: true,
			}
		});

		const total = await prisma.clients.count();

		const responseData = snakeToCamel(serializeBigInt({
			clients: clientsData,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			sort: { field: sortField, order: sortOrder }
		}));

		return json(
			responseData
		);
	} catch (error: any) {
		console.error('Error fetching clients:', error);
		return json({
			error: 'Failed to fetch clients',
			details: error, message: error.message
		}, { status: 500 });
	}
};

// POST /api/clients
export const POST: RequestHandler = async ({ request }) => {
	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);


		let mediaId: bigint | undefined;

		// If media_id is provided, use it
		if (data.media_id) {
			mediaId = BigInt(data.media_id);
		} else if (data.media_url) { 		// Otherwise, if media_url is provided, look it up
			const media = await prisma.media.findUnique({
				where: { url: data.media_url }
			});
			if (!media) {
				return json({ error: `Media with URL ${data.media_url} not found` }, { status: 404 });
			}
			mediaId = media.id;
		}

		if (!data.name) return json({ error: 'name is required' }, { status: 400 });

		const namePreprocessed = toTitleCase((data.name || '').trim());

		const newClient = await prisma.clients.create({
			data: {
				name: namePreprocessed,
				classification: data.classification,
				media_id: mediaId ?? null
			}
		});

		return json(serializeBigInt(newClient), { status: 201 });
	} catch (error: any) {
		console.error('Error creating client:', error);
		return json({
			error: 'Failed to create client',
			details: error, message: error.message
		}, { status: 500 });
	}
};

// PUT /api/clients?id=123
export const PUT: RequestHandler = async ({ request, url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Client ID is required' }, { status: 400 });

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		let updateData: any = {}; // 👈 Only push keys that exist

		// name
		if (typeof data.name !== 'undefined') {
			updateData.name = data.name;
		}

		// classification
		if (typeof data.classification !== 'undefined') {
			updateData.classification = data.classification;
		}

		// media_id handling
		if (typeof data.media_id !== 'undefined') {
			updateData.media_id = BigInt(data.media_id);

		} else if (
			typeof data.media_url === 'string' &&
			data.media_url.trim() !== ''
		) {
			const media = await prisma.media.findUnique({
				where: { url: data.media_url }
			});

			if (!media) {
				return json(
					{ error: `Media with URL ${data.media_url} not found` },
					{ status: 404 }
				);
			}

			updateData.media_id = media.id;
		}

		// If user sends empty body
		if (Object.keys(updateData).length === 0) {
			return json({ error: 'No valid fields to update' }, { status: 400 });
		}

		const updatedClient = await prisma.clients.update({
			where: { id: BigInt(idParam) },
			data: updateData,
			include: { projects: true }
		});

		const responseData = snakeToCamel(serializeBigInt(updatedClient));
		return json(responseData, { status: 200 });

	} catch (error: any) {
		console.error(`Error updating client ${idParam}:`, error);
		return json({
			error: `Failed to update client ${idParam}`,
			details: error, message: error.message
		}, { status: 500 });
	}
};

// DELETE /api/clients?id=123
export const DELETE: RequestHandler = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Client ID is required' }, { status: 400 });

	try {
		await prisma.clients.delete({ where: { id: BigInt(idParam) } });
		return json({ message: 'Client deleted successfully' });
	} catch (error: any) {
		console.error(`Error deleting client ${idParam}:`, error);
		return json({
			error: `Failed to delete client ${idParam}`,
			details: error, message: error.message
		}, { status: 500 });
	}
};
