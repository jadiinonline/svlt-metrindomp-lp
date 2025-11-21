// src/routes/api/projects/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';

const ALLOWED_SORT_FIELDS = ['name', 'created_at', 'year', 'po_price', 'status'];

export const GET: RequestHandler = async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') || '1');
	let limit = parseInt(url.searchParams.get('limit') || '100');

	page = Math.max(page, 1);
	limit = Math.min(Math.max(limit, 1), 200);
	const offset = (page - 1) * limit;

	let sortField = url.searchParams.get('sort') || 'created_at';
	let sortOrder = (url.searchParams.get('order') || 'desc').toLowerCase();
	if (!ALLOWED_SORT_FIELDS.includes(sortField)) sortField = 'created_at';
	if (sortOrder !== 'asc' && sortOrder !== 'desc') sortOrder = 'desc';

	try {
		const projectsData = await prisma.projects.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			include: {
				client: true,
				project_categories: {
					select: {
						service_category: {
							select: {
								id: true,
								name: true,
								media_id: true,
								media: true,
								created_at: true,
								updated_at: true
							}
						}
					}
				},
				project_medias: {
					select: {
						id: true,
						media: true,
						media_id: true,
						is_cover: true,
						caption: true
					}
				},
				project_tasks: {
					include: {
						project_task_images: {
							include: {
								media: true
							},
							orderBy: { id: 'asc' }
						}
					},
					orderBy: { order: 'asc' }
				}
			}
		});

		const projects = projectsData.map(p => {
			const { project_categories, project_medias, project_tasks, ...rest } = p;
			return {
				...rest,
				serviceCategories: project_categories.map(pc => pc.service_category),
				projectMedias: project_medias,
				tasks: project_tasks.map(t => ({
					id: t.id,
					uuid: t.uuid,
					name: t.name,
					description: t.description,
					order: t.order,
					createdAt: t.created_at,
					updatedAt: t.updated_at,
					images: t.project_task_images.map(pi => ({
						id: pi.id, uuid: pi.uuid, caption: pi.caption, isCover: pi.is_cover, media: pi.media
					}))
				}))
			};
		});

		const total = await prisma.projects.count();
		const totalPages = Math.ceil(total / limit);

		const responseData = snakeToCamel(serializeBigInt({
			projects, total, page, limit, totalPages, sort: { field: sortField, order: sortOrder }
		}));

		return json(responseData);
	} catch (error: any) {
		console.error('Error fetching projects:', error);
		return json({ error: 'Failed to fetch projects', details: error.message }, { status: 500 });
	}
};

// POST - create project (with optional project_medias and tasks + task images)
export const POST: RequestHandler = async ({ request }) => {
	try {
		const bodyRaw = await request.json();
		// Expect body shape (camelCase in frontend): { name, clientsId, poPrice, projectMedias?: [mediaId], tasks?: [{ name, description, images?: [mediaId] }] }
		const body = camelToSnakeSafe(bodyRaw);

		if (!body.name) return json({ error: 'name is required' }, { status: 400 });
		if (!body.clients_id) return json({ error: 'clients_id is required' }, { status: 400 });

		const poPrice = body.po_price !== undefined ? BigInt(body.po_price) : null;

		// Create project
		const created = await prisma.projects.create({
			data: {
				name: body.name,
				clients_id: BigInt(body.clients_id),
				po_price: poPrice,
				slug: body.slug ?? null,
				description: body.description ?? null,
				location: body.location ?? null,
				year: body.year ?? null,
				status: body.status ?? 'draft',
				start_date: body.start_date ? new Date(body.start_date) : null,
				end_date: body.end_date ? new Date(body.end_date) : null
			}
		});

		// Attach project_medias if provided (array of media ids)
		if (Array.isArray(body.project_medias) && body.project_medias.length) {
			for (const m of body.project_medias) {
				await prisma.project_medias.create({
					data: {
						projects_id: created.id,
						media_id: BigInt(m)
					}
				});
			}
		}

		// Create tasks and their images
		if (Array.isArray(body.project_tasks) && body.project_tasks.length) {
			for (const [idx, t] of body.project_tasks.entries()) {
				const tcreated = await prisma.project_tasks.create({
					data: {
						name: t.name,
						description: t.description ?? null,
						order: t.order ?? idx,
						projects_id: created.id
					}
				});
				if (Array.isArray(t.images) && t.images.length) {
					for (const mid of t.images) {
						await prisma.project_task_images.create({
							data: {
								task_id: tcreated.id,
								media_id: BigInt(mid)
							}
						});
					}
				}
			}
		}

		const out = await prisma.projects.findUnique({
			where: { id: created.id },
			include: {
				client: true,
				project_medias: { include: { media: true } },
				project_tasks: { include: { project_task_images: { include: { media: true } } } }
			}
		});

		return json(snakeToCamel(serializeBigInt(out)), { status: 201 });
	} catch (e: any) {
		console.error('create project', e);
		return json({ error: e.message }, { status: 500 });
	}
};

// PUT - update project and optionally update tasks and media associations
export const PUT: RequestHandler = async ({ request, url }) => {
	const id = url.searchParams.get('id');
	if (!id) return json({ error: 'id required' }, { status: 400 });

	try {
		const bodyRaw = await request.json();
		const body = camelToSnakeSafe(bodyRaw);

		const dataToUpdate: any = {
			name: body.name ?? undefined,
			slug: body.slug ?? undefined,
			description: body.description ?? undefined,
			location: body.location ?? undefined,
			year: body.year ?? undefined,
			po_price: body.po_price !== undefined ? BigInt(body.po_price) : undefined,
			status: body.status ?? undefined,
			start_date: body.start_date ? new Date(body.start_date) : undefined,
			end_date: body.end_date ? new Date(body.end_date) : undefined,
			clients_id: body.clients_id ? BigInt(body.clients_id) : undefined
		};

		const updated = await prisma.projects.update({
			where: { id: BigInt(id) },
			data: dataToUpdate
		});

		// If project_medias was supplied, replace existing set
		if (Array.isArray(body.project_medias)) {
			await prisma.project_medias.deleteMany({ where: { projects_id: BigInt(id) } });
			for (const m of body.project_medias) {
				await prisma.project_medias.create({
					data: { projects_id: BigInt(id), media_id: BigInt(m) }
				});
			}
		}

		// If project_tasks provided, this supports:
		// - new tasks (no id) -> create
		// - existing tasks (id) -> update
		// - if `replaceTasks: true` -> delete all existing tasks then create fresh
		if (body.replace_tasks) {
			await prisma.project_task_images.deleteMany({
				where: { task: { projects_id: BigInt(id) } }
			});
			await prisma.project_tasks.deleteMany({ where: { projects_id: BigInt(id) } });
		}

		if (Array.isArray(body.project_tasks)) {
			for (const t of body.project_tasks) {
				if (t.id) {
					// update
					await prisma.project_tasks.update({
						where: { id: BigInt(t.id) },
						data: {
							name: t.name ?? undefined,
							description: t.description ?? undefined,
							order: t.order ?? undefined
						}
					});

					// update images for this task if provided (replace)
					if (Array.isArray(t.images)) {
						await prisma.project_task_images.deleteMany({ where: { task_id: BigInt(t.id) } });
						for (const mid of t.images) {
							await prisma.project_task_images.create({
								data: { task_id: BigInt(t.id), media_id: BigInt(mid) }
							});
						}
					}
				} else {
					// create new task
					const createdTask = await prisma.project_tasks.create({
						data: {
							name: t.name,
							description: t.description ?? null,
							order: t.order ?? 0,
							projects_id: BigInt(id)
						}
					});
					if (Array.isArray(t.images)) {
						for (const mid of t.images) {
							await prisma.project_task_images.create({
								data: { task_id: createdTask.id, media_id: BigInt(mid) }
							});
						}
					}
				}
			}
		}

		const out = await prisma.projects.findUnique({
			where: { id: BigInt(id) },
			include: {
				client: true,
				project_medias: { include: { media: true } },
				project_tasks: { include: { project_task_images: { include: { media: true } } } }
			}
		});

		return json(snakeToCamel(serializeBigInt(out)));
	} catch (e: any) {
		console.error('update project', e);
		return json({ error: e.message }, { status: 500 });
	}
};

// DELETE - delete project and optionally orphan/link media (hard delete)
export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.id) return json({ error: 'id required' }, { status: 400 });

		const id = BigInt(body.id);

		// delete task images, tasks, project_medias, and project
		await prisma.project_task_images.deleteMany({
			where: { task: { projects_id: id } }
		});
		await prisma.project_tasks.deleteMany({ where: { projects_id: id } });
		await prisma.project_medias.deleteMany({ where: { projects_id: id } });
		await prisma.project_categories.deleteMany({ where: { projects_id: id } });

		await prisma.projects.delete({ where: { id } });
		return json({ ok: true });
	} catch (e: any) {
		console.error('delete project', e);
		return json({ error: e.message }, { status: 500 });
	}
};
