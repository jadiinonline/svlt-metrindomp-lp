// src/routes/api/media/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { compressImageBuffer, uploadBufferToGCS, generateMediaPath } from '$lib/utils/storage';
import { serializeBigInt, snakeToCamel, normalizeString } from '$lib/utils/utils';
import sharp from 'sharp';

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		let folder = (formData.get('folder')?.toString() || 'undefined-folder').trim();
		folder = normalizeString(folder);

		const altText = formData.get('alt_text')?.toString() || null;
		const uploaderId = formData.get('uploader_id')
			? BigInt(formData.get('uploader_id')!.toString())
			: 1;

		// Collect files from formData
		const files: File[] = [];
		for (const value of formData.values()) {
			if (value instanceof File) files.push(value);
		}

		if (files.length === 0) {
			return json({ error: 'No files uploaded' }, { status: 400 });
		}

		const createdItems: any[] = [];

		for (const f of files) {
			if (f.size > MAX_UPLOAD_BYTES) {
				return json({ error: `File ${f.name} exceeds 20MB limit` }, { status: 400 });
			}

			const arrayBuffer = await f.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			// Compress and get actual mime
			const { buffer: optimizedBuffer, mime } = await compressImageBuffer(buffer, 500);

			// Get image dimensions
			const metadata = await sharp(optimizedBuffer).metadata();
			const width = metadata.width ?? null;
			const height = metadata.height ?? null;

			// Generate path based on actual mime
			const destPath = generateMediaPath(folder, f.name);

			// Upload to GCS
			const publicUrl = await uploadBufferToGCS(optimizedBuffer, destPath, mime);

			// Save in DB
			const created = await prisma.media.create({
				data: {
					url: publicUrl,
					mime_type: mime,
					size_bytes: optimizedBuffer.length,
					width,
					height,
					alt_text: altText,
					uploader_id: uploaderId
				}
			});

			createdItems.push(created);
		}

		return json(
			snakeToCamel(serializeBigInt({ media: createdItems })),
			{ status: 201 }
		);

	} catch (err: any) {
		console.error('Media upload error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

// GET /api/media - list media
export const GET: RequestHandler = async ({ url }) => {
	const folder = url.searchParams.get('folder') || undefined;
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
	const offset = (page - 1) * limit;

	const where = folder ? { url: { contains: `/${folder}/` } } : {};

	const [items, total] = await Promise.all([
		prisma.media.findMany({ where, skip: offset, take: limit, orderBy: { created_at: 'desc' } }),
		prisma.media.count({ where })
	]);

	return json(snakeToCamel(serializeBigInt({ items, total, page, limit })));
};

// PATCH /api/media - update alt_text (rename/move can be added)
export const PATCH: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.id) return json({ error: 'id required' }, { status: 400 });

		const update: any = {};
		if (body.altText !== undefined) update.alt_text = body.altText;

		const updated = await prisma.media.update({
			where: { id: BigInt(body.id) },
			data: update
		});

		return json(snakeToCamel(serializeBigInt(updated)));
	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};

// DELETE /api/media - delete media
export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.id) return json({ error: 'id required' }, { status: 400 });

		const media = await prisma.media.findUnique({ where: { id: BigInt(body.id) } });
		if (!media) return json({ error: 'Not found' }, { status: 404 });

		await prisma.media.delete({ where: { id: BigInt(body.id) } });

		// Optionally delete from GCS here

		return json({ ok: true });
	} catch (err: any) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
};
