import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get("token")

	// Initialize data to empty arrays in case of errors
	let fetchOneData = [];

	try {
		const [fetchOneRes] = await Promise.all([
			fetch(`/api/project?limit=10000`, {
				headers: {
					authorization: `Bearer ${token}`,
					accept: "application/json",
				}
			}),

		]);

		if (!fetchOneRes.ok) {
			console.error('a user failed / unauthorized to fetch permissions');
		} else {
			fetchOneData = await fetchOneRes.json();
		}
		// console.log({ fetchOneData })


	} catch (error) {
		console.error(`Error loading data in file ${import.meta.url} :`, error)
	}

	return { fetchOneData };

}


