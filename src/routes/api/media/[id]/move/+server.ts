import { json, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { moveFile, getRelativePathFromUrl } from '$lib/utils/storage';
import { normalizeString } from '$lib/utils/utils';

export const PATCH: RequestHandler = async ({ request, params }) => {
	try {
		const { id } = params; // get id from URL
		if (!id) return json({ error: 'id required in URL' }, { status: 400 });

		const body = await request.json();
		const { newFolder } = body;
		if (!newFolder) return json({ error: 'newFolder required in request body' }, { status: 400 });

		const media = await prisma.media.findUnique({ where: { id: BigInt(id) } });
		if (!media) return json({ error: 'media_id not found' }, { status: 404 });

		const oldRelative = getRelativePathFromUrl(media.url);
		const filename = oldRelative.split('/').pop();
		if (!filename) return json({ error: 'Invalid file path' }, { status: 400 });

		const newRelative = `${normalizeString(newFolder)}/${filename}`;
		const newUrl = await moveFile(oldRelative, newRelative);

		await prisma.media.update({ where: { id: BigInt(id) }, data: { url: newUrl } });

		return json({ ok: true, url: newUrl });

	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};
