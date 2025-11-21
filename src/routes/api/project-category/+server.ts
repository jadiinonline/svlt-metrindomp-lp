import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';

// Allowed sorting fields
const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at'];

// GET /api/project-categories
export const GET: RequestHandler = async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') || '1');
	let limit = parseInt(url.searchParams.get('limit') || '10');
	let sortField = url.searchParams.get('sort') || 'created_at';
	let sortOrder = (url.searchParams.get('order') as 'asc' | 'desc') || 'desc';

	page = Math.max(page, 1);
	limit = Math.min(Math.max(limit, 1), 100);
	if (!ALLOWED_SORT_FIELDS.includes(sortField)) sortField = 'created_at';
	if (!['asc', 'desc'].includes(sortOrder)) sortOrder = 'desc';

	const offset = (page - 1) * limit;

	try {
		const categoriesData = await prisma.project_categories.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			include: {
				project: true,
				service_category: true,
			}
		});

		const total = await prisma.project_categories.count();

		const responseData = snakeToCamel(
			serializeBigInt({
				projectCategories: categoriesData,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
				sort: { field: sortField, order: sortOrder }
			})
		);

		return json(responseData);

	} catch (error: any) {
		console.error('Error fetching project categories:', error);
		return json({ error: 'Failed to fetch project categories', details: error, message: error.message }, { status: 500 });
	}
};

// POST /api/project-categories
export const POST: RequestHandler = async ({ request }) => {
	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		if (!data.projects_id) return json({ error: 'projects_id is required' }, { status: 400 });
		if (!data.service_categories_id) return json({ error: 'service_categories_id is required' }, { status: 400 });

		const newCategory = await prisma.project_categories.create({
			data: {
				projects_id: BigInt(data.projects_id),
				service_categories_id: BigInt(data.service_categories_id)
			},
			include: {
				project: true,
				service_category: true
			}
		});

		const responseData = snakeToCamel(serializeBigInt(newCategory));
		return json(responseData, { status: 201 });

	} catch (error: any) {
		console.error('Error creating project category:', error);
		return json({ error: 'Failed to create project category', details: error, message: error.message }, { status: 500 });
	}
};

// PUT /api/project-categories?id=123
export const PUT: RequestHandler = async ({ request, url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Project Category ID is required' }, { status: 400 });

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);


		const updatedCategory = await prisma.project_categories.update({
			where: { id: BigInt(idParam) },
			data: {
				projects_id: data.projects_id ? BigInt(data.projects_id) : undefined,
				service_categories_id: data.service_categories_id ? BigInt(data.service_categories_id) : undefined,
				updated_at: new Date()
			},
			include: {
				project: true,
				service_category: true
			}
		});

		const responseData = snakeToCamel(serializeBigInt(updatedCategory));
		return json(responseData);

	} catch (error: any) {
		console.error(`Error updating project category ${idParam}:`, error);
		return json({ error: `Failed to update project category ${idParam}`, details: error, message: error.message }, { status: 500 });
	}
};

// DELETE /api/project-categories?id=123
export const DELETE: RequestHandler = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Project Category ID is required' }, { status: 400 });

	try {
		await prisma.project_categories.delete({ where: { id: BigInt(idParam) } });
		return json({ message: 'Project category deleted successfully' });

	} catch (error: any) {
		console.error(`Error deleting project category ${idParam}:`, error);
		return json({ error: `Failed to delete project category ${idParam}`, details: error, message: error.message }, { status: 500 });
	}
};
