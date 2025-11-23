import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get("token")

	// Initialize data to empty arrays in case of errors
	let medias = [];

	try {
		const [mediaRes] = await Promise.all([
			fetch(`/api/media`, {
				headers: {
					authorization: `Bearer ${token}`,
					accept: "application/json",
				}
			}),

		]);

		if (!mediaRes.ok) {
			console.error('a user failed / unauthorized to fetch permissions');
		} else {
			medias = await mediaRes.json();

		}


	} catch (error) {
		console.error(`Error loading data in file ${import.meta.url} :`, error)
	}

	return { medias };

}


