import { locales } from '../locales/data.js'
import { browser } from '$app/environment'
import { loadLocale } from 'wuchale/load-utils'
import { get } from 'svelte/store';
// so that the loaders are registered, only here, not required in nested ones (below)
import '../locales/main.loader.svelte.js'
import '../locales/js.loader.js'
import { language } from '$lib/localstorage';

/** @type {import('./$types').LayoutLoad} */
export const load = async ({ url }) => {

	const locale = get(language) || 'id';

	// browser-only: check localStorage
	if (browser) {
		const locale = get(language) || 'en';
		if (!locales.includes(locale)) {
			return;
		}
		if (browser) {
			await loadLocale(locale);
		}
	}

	return {
		locale
	}
}