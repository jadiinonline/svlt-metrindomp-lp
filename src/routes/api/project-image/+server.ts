import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';

// Allowed sorting fields
const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at', 'is_cover'];

// GET /api/project-images
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
		const imagesData = await prisma.project_images.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			include: {
				project: true,
				media: true
			}
		});

		const total = await prisma.project_images.count();

		const responseData = snakeToCamel(
			serializeBigInt({
				projectImages: imagesData,
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
				sort: { field: sortField, order: sortOrder }
			})
		);

		return json(responseData);

	} catch (error: any) {
		console.error('Error fetching project images:', error);
		return json({ error: 'Failed to fetch project images', details: error, message: error.message }, { status: 500 });
	}
};

// POST /api/project-images
export const POST: RequestHandler = async ({ request }) => {
	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		if (!data.projects_id) return json({ error: 'projects_id is required' }, { status: 400 });
		if (!data.media_id) return json({ error: 'media_id is required' }, { status: 400 });

		const newImage = await prisma.project_images.create({
			data: {
				projects_id: BigInt(data.projects_id),
				media: data.image_link,
				is_cover: data.is_cover ?? false,
				caption: data.caption ?? null
			},
			include: {
				project: true
			}
		});

		const responseData = snakeToCamel(serializeBigInt(newImage));
		return json(responseData, { status: 201 });

	} catch (error: any) {
		console.error('Error creating project image:', error);
		return json({ error: 'Failed to create project image', details: error, message: error.message }, { status: 500 });
	}
};

// PUT /api/project-images?id=123
export const PUT: RequestHandler = async ({ request, url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Project Image ID is required' }, { status: 400 });

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		const updatedImage = await prisma.project_images.update({
			where: { id: BigInt(idParam) },
			data: {
				projects_id: data.projects_id ? BigInt(data.projects_id) : undefined,
				media_id: data.media_id ?? undefined,
				is_cover: data.is_cover ?? undefined,
				caption: data.caption ?? undefined,
				updated_at: new Date()
			},
			include: {
				project: true
			}
		});

		const responseData = snakeToCamel(serializeBigInt(updatedImage));
		return json(responseData);

	} catch (error: any) {
		console.error(`Error updating project image ${idParam}:`, error);
		return json({ error: `Failed to update project image ${idParam}`, details: error, message: error.message }, { status: 500 });
	}
};

// DELETE /api/project-images?id=123
export const DELETE: RequestHandler = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) return json({ error: 'Project Image ID is required' }, { status: 400 });

	try {
		await prisma.project_images.delete({ where: { id: BigInt(idParam) } });
		return json({ message: 'Project image deleted successfully' });

	} catch (error: any) {
		console.error(`Error deleting project image ${idParam}:`, error);
		return json({ error: `Failed to delete project image ${idParam}`, details: error, message: error.message }, { status: 500 });
	}
};
