export function serializeBigInt<T>(obj: T): T {
	return JSON.parse(
		JSON.stringify(obj, (_, value) =>
			typeof value === 'bigint' ? value.toString() : value
		)
	);
}

export function toTitleCase(str: string): string {
	return str
		.toLowerCase()
		.split(' ')
		.filter(Boolean)
		.map(word => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

type AnyObject = Record<string, any>;
/**
 * Converts camelCase keys to snake_case safely.
 * Preserves existing snake_case keys.
 * Throws an error if a conflict occurs (camelCase + snake_case for same key).
 */
export function camelToSnakeSafe(obj: AnyObject): AnyObject {
	const result: AnyObject = {};

	for (const key in obj) {
		if (!obj.hasOwnProperty(key)) continue;

		const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

		// Check for conflict
		if (snakeKey in result) {
			throw new Error(`Key conflict detected: "${key}" conflicts with existing key "${snakeKey}"`);
		}

		result[snakeKey] = obj[key];
	}

	return result;
}

export function snakeToCamel<T>(obj: T): T {
	if (Array.isArray(obj)) return obj.map(snakeToCamel) as unknown as T;
	else if (obj !== null && typeof obj === 'object') {
		return Object.entries(obj).reduce((acc, [key, value]) => {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) return acc;

			const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
			acc[camelKey] = snakeToCamel(value);
			return acc;
		}, {} as Record<string, any>) as T;
	} else return obj;
}

export function normalizeString(string: string): string {
	return string
		.trim()
		.toLowerCase()
		// collapse multiple slashes
		.replace(/\/+/g, '/')
		// normalize each segment individually
		.split('/')
		.map((part) =>
			part
				.replace(/\s+/g, '-')        // spaces → dashes
				.replace(/[^a-z0-9\-]/g, '') // remove non-alphanumeric & non-dash
				.replace(/\-+/g, '-')        // collapse multiple dashes
		)
		.join('/');
}