import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { serializeBigInt } from '$lib/utils/utils';

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const { id } = params; // get id from URL
		if (!id) return json({ error: 'id required in URL' }, { status: 400 });

		const body = await request.json();
		if (body.newAltText === undefined) {
			return json({ error: 'newAltText required in request body' }, { status: 400 });
		}

		const updated = await prisma.media.update({
			where: { id: BigInt(id) },
			data: { alt_text: body.newAltText }
		});

		// Serialize BigInt fields so JSON.stringify works
		const serialized = serializeBigInt(updated);

		return json({ ok: true, media: serialized });
	} catch (err: any) {
		console.error(err);
		return json({
			error: err.message,
			stack: err.stack
		}, { status: 500 });
	}
};
