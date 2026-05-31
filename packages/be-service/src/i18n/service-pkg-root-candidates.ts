import { resolve } from "node:path";

export const SERVICE_PKG_ROOT_CANDIDATES = [
	resolve(process.cwd(), "packages/be-service"),
	resolve(process.cwd(), "../../../packages/be-service"),
];
