// src/lib/storage.ts
import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

const GCS_BUCKET = process.env.GCS_BUCKET!;
if (!GCS_BUCKET) throw new Error('Missing GCS_BUCKET env');

const serviceAccountBase64 = process.env.GCS_SERVICE_ACCOUNT_BASE64!;
if (!serviceAccountBase64) throw new Error('Missing GCS_SERVICE_ACCOUNT_BASE64 env');

const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));

const storage = new Storage({
	projectId: serviceAccount.project_id,
	credentials: {
		client_email: serviceAccount.client_email,
		private_key: serviceAccount.private_key
	}
});

const bucket = storage.bucket(GCS_BUCKET);

/**
 * Compress any image buffer to WebP under target size
 */
export async function compressImageBuffer(inputBuffer: Buffer, maxSizeKb = 500) {
	const targetBytes = maxSizeKb * 1024;
	let quality = 90;
	let buf = inputBuffer;

	for (let i = 0; i < 8; i++) {
		buf = await sharp(inputBuffer)
			.rotate()
			.resize({ width: 2000, withoutEnlargement: true })
			.webp({ quality })
			.toBuffer();

		if (buf.length <= targetBytes) return { buffer: buf, mime: 'image/webp' };

		quality = Math.max(30, Math.floor(quality * 0.75));
	}

	// fallback heavy resize
	const bufSmall = await sharp(inputBuffer)
		.rotate()
		.resize({ width: 1200, withoutEnlargement: true })
		.webp({ quality: 60 })
		.toBuffer();

	return { buffer: bufSmall, mime: 'image/webp' };
}

/**
 * Upload buffer to Google Cloud Storage
 */
export async function uploadBufferToGCS(buffer: Buffer, destPathInput: string, mime: string) {
	const destPath = `metrindomp/api/media/${destPathInput}`;

	const file = bucket.file(destPath);

	const streamObj = file.createWriteStream({
		metadata: {
			contentType: mime,
			cacheControl: 'public, max-age=31536000',
		},
		resumable: false,
		public: true,
	});

	await pipeline(stream.Readable.from(buffer), streamObj);

	// Make public URL
	const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${encodeURI(destPath)}`;
	await file.makePublic();

	return publicUrl;
}

/**
 * Generate a random media path with WebP extension
 */
export function generateMediaPath(folder = 'misc', originalName = '') {
	const ext = '.webp';
	const random = randomBytes(6).toString('hex');
	const filename = `${Date.now()}-${random}${ext}`; //the date x random combination make it unique
	return `${folder.replace(/^\//, '').replace(/\/$/, '')}/${filename}`;
}
