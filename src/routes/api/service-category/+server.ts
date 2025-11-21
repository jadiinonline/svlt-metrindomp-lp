import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';


// Allowed sorting fields
const ALLOWED_SORT_FIELDS = ['name', 'created_at', 'updated_at'];

// GET /api/service-categories
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
		const categoriesData = await prisma.service_categories.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			// include: {
			// 	project_categories: true
			// }
		});

		const total = await prisma.service_categories.count();

		const responseData = snakeToCamel(serializeBigInt({
			serviceCategories: categoriesData,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			sort: { field: sortField, order: sortOrder }
		}));

		return json(responseData);

	} catch (error: any) {
		console.error('Error fetching service categories:', error);
		return json({
			error: 'Failed to fetch service categories',
			details: error, message: error.message
		}, { status: 500 });
	}
};

// POST /api/service-categories
export const POST: RequestHandler = async ({ request }) => {
	try {

		// Convert request from camelCase → snake_case
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		if (!data.name) return json({ error: 'name is required' }, { status: 400 });

		const namePreprocessed = (data.name || '').trim().toLowerCase();

		const newCategory = await prisma.service_categories.create({
			data: {
				name: namePreprocessed,
				description: data.description ?? null
			}
		});

		const responseData = snakeToCamel(serializeBigInt(newCategory));

		return json(responseData, { status: 201 });
	} catch (error: any) {
		console.error('Error creating service category:', error);
		return json({
			error: 'Failed to create service category',
			details: error, message: error.message
		}, { status: 500 });
	}
};

// PUT /api/service-categories?id=123
export const PUT: RequestHandler = async ({ request, url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Category ID is required' }, { status: 400 });

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		// console.log('Updating service-category', idParam, 'with data:', data);

		const updatedCategory = await prisma.service_categories.update({
			where: { id: BigInt(idParam) },
			data: {
				name: data.name || undefined,
				description: data.description ?? undefined,
				media_id: data.media_id ?? undefined,
				updated_at: new Date()
			},
			include: { project_categories: true }
		});

		const responseData = snakeToCamel(serializeBigInt(updatedCategory))

		return json(responseData);
	} catch (error: any) {
		console.error(`Error updating category ${idParam}:`, error);
		return json({
			error: `Failed to update category ${idParam}`,
			details: error, message: error.message
		}, { status: 500 });
	}
};

// DELETE /api/service-categories?id=123
export const DELETE: RequestHandler = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Category ID is required' }, { status: 400 });

	try {
		await prisma.service_categories.delete({ where: { id: BigInt(idParam) } });
		return json({ message: 'Category deleted successfully' });
	} catch (error: any) {
		console.error(`Error deleting category ${idParam}:`, error);
		return json({
			error: `Failed to delete category ${idParam}`,
			details: error, message: error.message
		}, { status: 500 });
	}
};
