// src/routes/api/project/[projectId]/task/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { camelToSnakeSafe, snakeToCamel, serializeBigInt } from '$lib/utils/utils';

export const POST: RequestHandler = async ({ request, params }) => {
	const projectId = params.projectId;

	if (!projectId) {
		return json({ error: 'projectId is required' }, { status: 400 });
	}

	try {
		const bodyRaw = await request.json();
		const body = camelToSnakeSafe(bodyRaw);

		if (!body.name) {
			return json({ error: 'name is required' }, { status: 400 });
		}

		const created = await prisma.project_tasks.create({
			data: {
				name: body.name,
				description: body.description ?? null,
				order: body.order ?? 0,
				projects_id: BigInt(projectId)
			}
		});

		return json(
			snakeToCamel(
				serializeBigInt({
					id: created.id,
					uuid: created.uuid,
					name: created.name,
					description: created.description,
					order: created.order,
					projectsId: created.projects_id,
					createdAt: created.created_at,
					updatedAt: created.updated_at
				})
			),
			{ status: 201 }
		);
	} catch (e: any) {
		console.error('create project task', e);
		return json(
			{ error: 'Failed to create task', details: e.message },
			{ status: 500 }
		);
	}
};
