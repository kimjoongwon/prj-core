import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const clientFilePath = path.resolve(
	scriptDir,
	"../src/generated/client/client.ts",
);

const source = await fs.readFile(clientFilePath, "utf8");

const esmDirnameSnippet = [
	"import * as path from 'node:path'",
	"import { fileURLToPath } from 'node:url'",
	"globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))",
].join("\n");

if (!source.includes(esmDirnameSnippet)) {
	if (source.includes("globalThis['__dirname'] = __dirname")) {
		process.exit(0);
	}

	throw new Error(
		`Expected Prisma generated client prelude not found: ${clientFilePath}`,
	);
}

const normalized = source.replace(
	esmDirnameSnippet,
	"globalThis['__dirname'] = __dirname",
);

await fs.writeFile(clientFilePath, normalized, "utf8");
