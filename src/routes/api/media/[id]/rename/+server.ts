import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { renameFile, getRelativePathFromUrl } from '$lib/utils/storage';

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const { id } = params;
		if (!id) return json({ error: 'id required in URL' }, { status: 400 });

		const { newName } = await request.json();
		if (!newName) return json({ error: 'newName required in request body' }, { status: 400 });

		const media = await prisma.media.findUnique({ where: { id: BigInt(id) } });
		if (!media) return json({ error: 'media_id not found' }, { status: 404 });

		const oldRelative = getRelativePathFromUrl(media.url);

		// Rename file using reusable storage function, which now returns the new public URL
		const newUrl = await renameFile(oldRelative, newName);

		// Update DB
		await prisma.media.update({ where: { id: BigInt(id) }, data: { url: newUrl } });

		return json({ ok: true, url: newUrl });

	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};
