// src/routes/api/media/[id]/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { getRelativePathFromUrl, deleteFile } from '$lib/utils/storage';

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		if (!id) return json({ error: 'id required in URL' }, { status: 400 });

		const media = await prisma.media.findUnique({ where: { id: BigInt(id) } });
		if (!media) return json({ error: 'media_id not found' }, { status: 404 });

		// Get relative path from URL
		const relativePath = getRelativePathFromUrl(media.url);

		// Delete file from storage
		await deleteFile(relativePath);

		// Delete record from DB
		await prisma.media.delete({ where: { id: BigInt(id) } });

		return json({ ok: true });
	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};