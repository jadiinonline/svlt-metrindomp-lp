// src/lib/storage.ts
import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

// ------------------------------
// ENV VALIDATION
// ------------------------------
const GCS_BUCKET = process.env.GCS_BUCKET;
if (!GCS_BUCKET) throw new Error('Missing GCS_BUCKET env');

const serviceAccountBase64 = process.env.GCS_SERVICE_ACCOUNT_BASE64;
if (!serviceAccountBase64) throw new Error('Missing GCS_SERVICE_ACCOUNT_BASE64 env');

const serviceAccount = JSON.parse(
	Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
);

// ------------------------------
// STORAGE INIT
// ------------------------------
const storage = new Storage({
	projectId: serviceAccount.project_id,
	credentials: {
		client_email: serviceAccount.client_email,
		private_key: serviceAccount.private_key
	}
});

const bucket = storage.bucket(GCS_BUCKET);

// Root folder for all your app files
const MEDIA_ROOT = "metrindomp/api/media";

export function buildMediaPath(relative: string) {
	return `${MEDIA_ROOT}/${relative.replace(/^\//, "")}`;
}

// ------------------------------
// IMAGE DETECTION
// ------------------------------
export function detectImageMime(buffer: Buffer): string {
	const sig = buffer.subarray(0, 4).toString("hex");

	if (sig.startsWith("89504e47")) return "image/png";      // PNG
	if (sig.startsWith("ffd8ff")) return "image/jpeg";     // JPG/JPEG
	if (sig.startsWith("52494646")) return "image/webp";     // WEBP (RIFF)

	return "application/octet-stream";
}

// ------------------------------
// IMAGE COMPRESSION (always WebP)
// ------------------------------
export async function compressImageBuffer(inputBuffer: Buffer, maxSizeKb = 500) {
	const targetBytes = maxSizeKb * 1024;
	let quality = 90;

	for (let i = 0; i < 8; i++) {
		const buffer = await sharp(inputBuffer)
			.rotate()
			.resize({ width: 2000, withoutEnlargement: true })
			.webp({ quality })
			.toBuffer();

		if (buffer.length <= targetBytes) {
			return { buffer, mime: "image/webp" };
		}

		quality = Math.max(30, Math.floor(quality * 0.75));
	}

	// fallback, heavy compression
	const buffer = await sharp(inputBuffer)
		.rotate()
		.resize({ width: 1200, withoutEnlargement: true })
		.webp({ quality: 60 })
		.toBuffer();

	return { buffer, mime: "image/webp" };
}

// ------------------------------
// UPLOAD BUFFER TO STORAGE
// ------------------------------
export async function uploadBufferToGCS(buffer: Buffer, relativePath: string, mime: string) {
	const destPath = buildMediaPath(relativePath);
	const file = bucket.file(destPath);

	const writeStream = file.createWriteStream({
		metadata: {
			contentType: mime,
			cacheControl: "public, max-age=31536000"
		},
		resumable: false,
		public: true
	});

	await pipeline(stream.Readable.from(buffer), writeStream);
	await file.makePublic();

	return `https://storage.googleapis.com/${GCS_BUCKET}/${encodeURI(destPath)}`;
}

// ------------------------------
// AUTO: detect → compress → upload
// ------------------------------
export async function autoCompressAndUpload(
	buffer: Buffer,
	folder = "misc",
	originalName = ""
) {
	const { buffer: compressed, mime } = await compressImageBuffer(buffer);
	const path = generateMediaPath(folder);

	const compressedMetadata = await sharp(compressed).metadata();


	const url = await uploadBufferToGCS(compressed, path, mime);

	return { url, path, compressedMetadata };
}

// ------------------------------
// GENERATE FILE PATH
// ------------------------------
export function generateMediaPath(folder = "misc") {
	const safeFolder = folder.replace(/^\//, "").replace(/\/$/, "");
	const unique = `${Date.now()}-${randomBytes(6).toString("hex")}`;

	return `${safeFolder}/${unique}.webp`;
}

// ------------------------------
// MOVE FILE
// ------------------------------
export async function moveFile(oldRelative: string, newRelative: string) {
	const oldPath = buildMediaPath(oldRelative);
	const newPath = buildMediaPath(newRelative);

	await bucket.file(oldPath).move(newPath);

	return `https://storage.googleapis.com/${GCS_BUCKET}/${encodeURI(newPath)}`;
}


// Get relative path from public URL
export function getRelativePathFromUrl(url: string) {
	const prefix = `https://storage.googleapis.com/${GCS_BUCKET}/${MEDIA_ROOT}/`;
	if (!url.startsWith(prefix)) throw new Error("URL not from our bucket");
	return url.slice(prefix.length); // everything after MEDIA_ROOT/
}


// ------------------------------
// DELETE FILE
// ------------------------------
export async function deleteFile(relative: string) {
	const filePath = buildMediaPath(relative);
	await bucket.file(filePath).delete({ ignoreNotFound: true });

	return true;
}

// ------------------------------
// RENAME FILE
// ------------------------------
export async function renameFile(relative: string, newName: string) {
	const ext = path.extname(relative) || ".webp";
	const folder = path.dirname(relative);
	const newRelative = `${folder}/${newName}${ext}`;

	// Move file internally
	await moveFile(relative, newRelative);

	// Build public URL
	const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET}/${buildMediaPath(newRelative)}`;
	return publicUrl;
}

// ------------------------------
// LIST FILES IN A FOLDER
// ------------------------------
export async function listFiles(folder: string) {
	const prefix = buildMediaPath(folder.replace(/\/$/, "") + "/");

	const [files] = await bucket.getFiles({ prefix });

	return files.map((f) => {
		const relative = f.name.replace(MEDIA_ROOT + "/", "");
		const fileName = relative.split("/").pop() ?? "";

		return {
			relative, // e.g. "proyek-1/foto1.jpg"
			fileName, // e.g. "foto1.jpg"
			size: f.metadata.size,
			url: `https://storage.googleapis.com/${GCS_BUCKET}/${encodeURI(f.name)}`
		};
	});
}
