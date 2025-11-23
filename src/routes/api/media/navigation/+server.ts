import { json } from '@sveltejs/kit';
import { listFiles } from '$lib/utils/storage';
import { normalizeString } from '$lib/utils/utils.js';

export const GET = async ({ url }) => {
	let folder = url.searchParams.get('folder') || ''; // '' means root
	folder = normalizeString(folder);

	const files = await listFiles(folder);

	// Determine folder depth
	const folderDepth = folder ? folder.split('/').length : 0;

	// Collect subfolders
	const foldersSet = new Set<string>();
	const mediaFiles: typeof files = [];

	files.forEach((f) => {
		const parts = f.relative.split('/').slice(folderDepth);
		if (parts.length > 1) {
			// Nested folder
			foldersSet.add(parts[0]);
		} else if (folder) {
			// Only include files if we are inside a subfolder
			mediaFiles.push(f);
		}
	});

	return json({
		folders: Array.from(foldersSet),
		mediaFiles: folder ? mediaFiles : [] // root folder has no files
	});
};
