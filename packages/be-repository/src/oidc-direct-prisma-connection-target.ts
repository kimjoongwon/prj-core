export function getOidcDirectPrismaConnectionTarget(
	connectionString: string,
): string {
	try {
		const url = new URL(connectionString);
		return `${url.hostname}:${url.port || "5432"}`;
	} catch {
		return "unknown";
	}
}
