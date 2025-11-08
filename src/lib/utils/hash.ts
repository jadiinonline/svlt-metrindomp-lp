import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
	return bcrypt.compare(plain, hash);
}

// Run from terminal: npm run hash "string"
if (import.meta.url === `file://${process.argv[1]}`) {
	const input = process.argv[2];
	if (!input) {
		console.log("Usage: npm run hash \"your-string\"");
		process.exit(1);
	}

	const UUID = crypto.randomUUID();

	hashPassword(input).then((hashed) => {
		console.log({ hashed, UUID });
	});
}
