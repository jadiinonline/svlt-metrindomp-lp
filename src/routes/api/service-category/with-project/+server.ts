import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel } from '$lib/utils/utils';

const ALLOWED_SORT_FIELDS = ['name', 'created_at', 'updated_at'];

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
		const servicesData = await prisma.service_categories.findMany({
			skip: offset,
			take: limit,
			orderBy: { [sortField]: sortOrder },
			include: {
				media: true,
				project_categories: {
					select: {
						project: {
							select: {
								id: true,
								uuid: true,
								name: true,
								slug: true,
								location: true,
								description: true,
								start_date: true,
								end_date: true,
								year: true,
								po_price: true,
								status: true,
								created_at: true,
								updated_at: true,
								clients_id: true,
								client: {
									select: {
										id: true,
										uuid: true,
										name: true,
										media_id: true,
										media: true,
										created_at: true,
										updated_at: true
									}
								},
								project_medias: {
									select: {
										id: true,
										media_id: true,
										media: true,
										is_cover: true,
										caption: true
									}
								}
							}
						}
					}
				}
			}
		});

		const total = await prisma.service_categories.count();

		const totalPages = Math.ceil(total / limit);

		// Circular previous/next pages
		const pagePrevious = page === 1 ? totalPages : page - 1;
		const pageNext = page === totalPages ? 1 : page + 1;


		const services = servicesData.map(s => {
			const projects = s.project_categories
				?.map(pc => pc.project)
				.filter((p): p is NonNullable<typeof p> => !!p) || [];

			const uniqueProjects = Array.from(
				new Map(projects.map(p => [p.id.toString(), p])).values()
			);

			const { project_categories, ...rest } = s; // remove nested relation to avoid duplication

			return {
				...rest,
				projects: uniqueProjects
			};

		});

		const responseData = snakeToCamel(
			serializeBigInt({
				serviceCategories: services,
				total,
				page,
				limit,
				totalPages: totalPages,
				pagePrevious,
				pageNext,
				sort: { field: sortField, order: sortOrder }
			})
		);

		return json(responseData);

	} catch (error: any) {
		console.error('Error fetching service categories with projects:', error);
		return json({
			error: 'Failed to fetch service categories with projects',
			details: error,
			message: error?.message
		}, { status: 500 });
	}
};
