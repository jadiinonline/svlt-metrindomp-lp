import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { serializeBigInt, snakeToCamel, camelToSnakeSafe } from '$lib/utils/utils';

/**
 * PUT /api/project/task/[id]
 */
export const PUT: RequestHandler = async ({ request, params }) => {
	const idParam = params.id;
	if (!idParam) {
		return json({ error: 'Project Task ID is required' }, { status: 400 });
	}

	try {
		const dataRaw = await request.json();
		const data = camelToSnakeSafe(dataRaw);

		// build update object (only provided fields)
		const updateData: any = {
			updated_at: new Date()
		};


		if (typeof data.name === 'string') {
			updateData.name = data.name;
		}

		if (typeof data.description === 'string') {
			updateData.description = data.description;
		}

		if (typeof data.order === 'number') {
			updateData.order = data.order;
		}

		if (Object.keys(updateData).length === 1) {
			return json({ error: 'No valid fields to update' }, { status: 400 });
		}

		// console.log({ updateData })


		const updated = await prisma.project_tasks.update({
			where: {
				id: BigInt(idParam)
			},
			data: updateData
		});


		return json(
			snakeToCamel(serializeBigInt(updated))
		);
	} catch (error: any) {
		console.error(`Error updating project task ${idParam}:`, error);
		return json(
			{
				error: `Failed to update project task ${idParam}`,
				message: error.message
			},
			{ status: 500 }
		);
	}
};
