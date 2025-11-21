import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma'; // <-- use the shared Prisma client
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';

// Define allowed columns for sorting to prevent SQL injection
const ALLOWED_SORT_FIELDS = ['name', 'created_at', 'year', 'po_price', 'status'];

export const GET: RequestHandler = async ({ url }) => {
	// --- Pagination ---
	let page = parseInt(url.searchParams.get('page') || '1');
	let limit = parseInt(url.searchParams.get('limit') || '100');

	page = Math.max(page, 1);
	limit = Math.min(Math.max(limit, 1), 100);

	const offset = (page - 1) * limit;

	// --- Sorting ---
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
				project_categories: {       // include categories with their service_category
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
				project_images: {
					select: {
						id: true,
						media: true,
						media_id: true,
						is_cover: true,
						caption: true
					}
				}

			}
		});

		// Restructure projects to include serviceCategories directly
		const projects = projectsData.map(p => {
			const { project_categories, project_images, ...rest } = p;
			return {
				...rest,
				serviceCategories: project_categories.map(pc => pc.service_category),
				projectImages: project_images // already in correct shape
			};
		});

		const total = await prisma.projects.count();
		const totalPages = Math.ceil(total / limit);

		const responseData = snakeToCamel(serializeBigInt({
			projects,
			total,
			page,
			limit,
			totalPages,
			sort: { field: sortField, order: sortOrder }
		}));

		// ✅ Convert all ids + bigint fields → string so json() can send them
		return json(
			responseData
		);

	} catch (error: any) {
		console.error('Error fetching projects:', error);
		return json({
			error: 'Failed to fetch projects',
			details: error, message: error.message
		}, { status: 500 });
	}
};


// POST /api/project - Create a new project
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.name) return json({ error: 'name is required' }, { status: 400 });
		if (!data.clients_id) return json({ error: 'clients_id is required' }, { status: 400 });

		const poPriceBigInt =
			data.po_price !== undefined && data.po_price !== null
				? BigInt(data.po_price)
				: null;

		const newProject = await prisma.projects.create({
			data: {
				name: data.name,
				clients_id: BigInt(data.clients_id),
				po_price: poPriceBigInt,
				slug: data.slug ?? null,
				description: data.description ?? null,
				location: data.location ?? null,
				year: data.year ?? null,
				status: data.status || 'draft',
				start_date: data.start_date ? new Date(data.start_date) : null,
				end_date: data.end_date ? new Date(data.end_date) : null
			}
		});

		const responseData = snakeToCamel(serializeBigInt(newProject))

		// ✅ Convert BigInt → String for JSON response
		return json(responseData, { status: 201 });

	} catch (error: any) {
		console.error('Error creating project:', error);
		return json({
			error: 'Failed to create project',
			details: error, message: error.message
		}, { status: 500 });
	}
};

// PUT /api/project?id=123 - Update an existing project
export const PUT: RequestHandler = async ({ request, url }) => {
	const id = url.searchParams.get('id');
	if (!id) {
		return json({ error: 'Project ID is required' }, { status: 400 });
	}

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		const updatedProject = await prisma.projects.update({
			where: {
				id: BigInt(id), // convert to BigInt
			},
			data: {
				name: data.name || undefined,
				slug: data.slug || undefined,
				description: data.description || undefined,
				location: data.location || undefined,
				year: data.year || undefined,
				po_price: data.po_price || undefined,
				status: data.status || undefined,
				start_date: data.start_date ? new Date(data.start_date) : undefined,
				end_date: data.end_date ? new Date(data.end_date) : undefined,
				clients_id: data.clients_id ? BigInt(data.clients_id) : undefined,
			},
		});

		const responseData = snakeToCamel(serializeBigInt(updatedProject))

		return json(responseData, { status: 200 });
	} catch (error: any) {
		console.error(`Error updating project with ID ${id}:`, error);
		return json({
			error: `Failed to update project with ID ${id}`,
			details: error, message: error.message
		}, { status: 500 });
	}
};


