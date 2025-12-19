import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';

// Allowed sorting fields
const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at', 'is_cover'];

/**
 * GET /api/project/task-image
 * Optional listing for task images
 */
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
		const imagesData = await prisma.project_task_images.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			include: {
				task: true
			}
		});

		const total = await prisma.project_task_images.count();

		return json(
			snakeToCamel(
				serializeBigInt({
					taskImages: imagesData,
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					sort: { field: sortField, order: sortOrder }
				})
			)
		);
	} catch (error: any) {
		console.error('Error fetching task images:', error);
		return json(
			{ error: 'Failed to fetch task images', message: error.message },
			{ status: 500 }
		);
	}
};

/**
 * POST /api/project/task-image
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		if (!data.projects_tasks_id) {
			return json({ error: 'projectsTasksId is required' }, { status: 400 });
		}

		if (!data.image_link) {
			return json({ error: 'imageLink is required' }, { status: 400 });
		}

		const created = await prisma.project_task_images.create({
			data: {
				task_id: BigInt(data.projects_tasks_id),
				media: data.image_link,
				is_cover: data.is_cover ?? false,
				caption: data.caption ?? null
			},
			include: {
				task: true
			}
		});

		return json(
			snakeToCamel(serializeBigInt(created)),
			{ status: 201 }
		);
	} catch (error: any) {
		console.error('Error creating task image:', error);
		return json(
			{ error: 'Failed to create task image', message: error.message },
			{ status: 500 }
		);
	}
};

/**
 * PUT /api/project/task-image?id=123
 */
export const PUT: RequestHandler = async ({ request, url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) {
		return json({ error: 'Task Image ID is required' }, { status: 400 });
	}

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		const updated = await prisma.project_task_images.update({
			where: { id: BigInt(idParam) },
			data: {
				task_id: data.projects_tasks_id
					? BigInt(data.projects_tasks_id)
					: undefined,
				media: data.image_link ?? undefined,
				is_cover: data.is_cover ?? undefined,
				caption: data.caption ?? undefined,
				updated_at: new Date()
			},
			include: {
				task: true
			}
		});

		return json(snakeToCamel(serializeBigInt(updated)));
	} catch (error: any) {
		console.error(`Error updating task image ${idParam}:`, error);
		return json(
			{ error: `Failed to update task image ${idParam}`, message: error.message },
			{ status: 500 }
		);
	}
};

/**
 * DELETE /api/project/task-image?id=123
 */
export const DELETE: RequestHandler = async ({ url }) => {
	const idParam = url.searchParams.get('id');
	if (!idParam) {
		return json({ error: 'Task Image ID is required' }, { status: 400 });
	}

	try {
		await prisma.project_task_images.delete({
			where: { id: BigInt(idParam) }
		});

		return json({ message: 'Task image deleted successfully' });
	} catch (error: any) {
		console.error(`Error deleting task image ${idParam}:`, error);
		return json(
			{ error: `Failed to delete task image ${idParam}`, message: error.message },
			{ status: 500 }
		);
	}
};
