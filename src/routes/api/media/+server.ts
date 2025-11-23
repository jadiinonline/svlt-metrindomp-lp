// src/routes/api/media/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

import {
	autoCompressAndUpload,
	generateMediaPath,
	getRelativePathFromUrl,
	moveFile,
	deleteFile
} from '$lib/utils/storage';

import {
	serializeBigInt,
	snakeToCamel,
	normalizeString
} from '$lib/utils/utils';

import sharp from 'sharp';

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB

// ---------------------------------------------------
// POST /api/media  → upload images
// ---------------------------------------------------
export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		let folder = (formData.get('folder')?.toString() || 'undefined-folder').trim();
		folder = normalizeString(folder);

		const altText = formData.get('alt_text')?.toString() || 'undefined alt text';

		const uploaderId = formData.get('uploader_id')
			? BigInt(formData.get('uploader_id')!.toString())
			: 1;

		// Collect uploaded files
		const files: File[] = [];
		for (const value of formData.values()) {
			if (value instanceof File) files.push(value);
		}

		if (files.length === 0) {
			return json({ error: 'No files uploaded' }, { status: 400 });
		}

		const createdMedia: any[] = [];

		for (const f of files) {
			if (f.size > MAX_UPLOAD_BYTES) {
				return json({ error: `File ${f.name} exceeds 20MB limit` }, { status: 400 });
			}

			const buffer = Buffer.from(await f.arrayBuffer());

			// Auto-detect, compress to webp, upload
			const upload = await autoCompressAndUpload(buffer, folder, f.name);


			const created = await prisma.media.create({
				data: {
					url: upload.url,
					mime_type: 'image/webp',
					size_bytes: Number(upload.compressedMetadata.size),
					width: upload.compressedMetadata.width ?? null,
					height: upload.compressedMetadata.height ?? null,
					alt_text: altText,
					uploader_id: uploaderId
				}
			});

			createdMedia.push(created);
		}

		return json(
			snakeToCamel(serializeBigInt({ media: createdMedia })),
			{ status: 201 }
		);

	} catch (err: any) {
		console.error('Media upload error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

// ---------------------------------------------------
// GET /api/media  → list media
// ---------------------------------------------------
export const GET: RequestHandler = async ({ url }) => {
	const folder = url.searchParams.get('folder') || undefined;
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
	const offset = (page - 1) * limit;

	const where = folder ? { url: { contains: `/${folder}/` } } : {};


	const [mediasRaw, total] = await Promise.all([
		prisma.media.findMany({
			where,
			skip: offset,
			take: limit,
			orderBy: { created_at: 'desc' }
		}),
		prisma.media.count({ where })
	]);

	// Add fileName to each media
	const medias = mediasRaw.map(m => ({
		...m,
		fileName: m.url.split('/').pop() // extract string after last '/'
	}));


	return json(snakeToCamel(serializeBigInt({
		medias,
		total,
		page,
		limit
	})));
};

// ---------------------------------------------------
// PATCH /api/media → update alt text OR move file
// ---------------------------------------------------
export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.id) return json({ error: 'id required' }, { status: 400 });

		const id = BigInt(body.id);
		const existing = await prisma.media.findUnique({ where: { id } });

		if (!existing) return json({ error: 'media_id not found' }, { status: 404 });

		const update: any = {};

		// Update alt text
		if (body.altText !== undefined) {
			update.alt_text = body.altText;
		}

		// Move to a new folder
		if (body.newFolder) {
			const newFolder = normalizeString(body.newFolder);

			// Extract relative path from full URL
			const relativePath = existing.url.split(`/${process.env.GCS_BUCKET}/`)[1];

			const filename = relativePath.split('/').pop();
			const newRelative = `${newFolder}/${filename}`;

			// Move via reusable util
			const newPublicUrl = await moveFile(relativePath, newRelative);

			update.url = newPublicUrl;
		}

		const updated = await prisma.media.update({
			where: { id },
			data: update
		});

		return json(snakeToCamel(serializeBigInt(updated)));

	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};

// ---------------------------------------------------
// DELETE /api/media → delete DB + GCS file
// ---------------------------------------------------
export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		if (!body.id && !body.url) {
			return json({ error: 'id or url required' }, { status: 400 });
		}

		let mediaUrl: string;

		if (body.id) {
			const id = BigInt(body.id);
			const media = await prisma.media.findUnique({ where: { id } });
			if (!media) return json({ error: 'Media not found' }, { status: 404 });

			mediaUrl = media.url;

			// Delete from DB
			await prisma.media.delete({ where: { id } });
		} else {
			mediaUrl = body.url;
			// Optionally delete DB record if exists
			await prisma.media.deleteMany({ where: { url: mediaUrl } });
		}

		// Delete file from storage
		const relativePath = getRelativePathFromUrl(mediaUrl);
		await deleteFile(relativePath);

		return json({ ok: true });
	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};