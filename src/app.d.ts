// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

	}

	interface ProjectList {
		title?: string,
		images?: string[],
		description?: string,
		year?: number,
		location?: string,
		categories?: string[],
		client?: string
	}
}

export { };
