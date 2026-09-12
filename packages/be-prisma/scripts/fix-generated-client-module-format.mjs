import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const generatedClientDir = path.resolve(scriptDir, "../src/generated/client");
const clientFilePath = path.join(generatedClientDir, "client.ts");

const source = await fs.readFile(clientFilePath, "utf8");

const esmDirnameSnippet = [
	"import * as path from 'node:path'",
	"import { fileURLToPath } from 'node:url'",
	"globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))",
].join("\n");

const hasSupportedGeneratedPrelude =
	source.includes("globalThis['__dirname'] = __dirname") ||
	(!source.includes("globalThis['__dirname']") &&
		source.includes(
			'import * as runtime from "@prisma/client/runtime/client"',
		));

if (!source.includes(esmDirnameSnippet) && !hasSupportedGeneratedPrelude) {
	throw new Error(
		`Expected Prisma generated client prelude not found: ${clientFilePath}`,
	);
}

const normalizedClientSource = source.replace(
	esmDirnameSnippet,
	"globalThis['__dirname'] = __dirname",
);

await fs.writeFile(clientFilePath, normalizedClientSource, "utf8");

const normalizeGeneratedTypeScriptFiles = async (directoryPath) => {
	for (const directoryEntry of await fs.readdir(directoryPath, {
		withFileTypes: true,
	})) {
		const generatedEntryPath = path.join(directoryPath, directoryEntry.name);
		if (directoryEntry.isDirectory()) {
			await normalizeGeneratedTypeScriptFiles(generatedEntryPath);
			continue;
		}
		if (!directoryEntry.isFile() || !directoryEntry.name.endsWith(".ts")) {
			continue;
		}

		const generatedSource = await fs.readFile(generatedEntryPath, "utf8");
		const normalizedGeneratedSource = generatedSource.replace(/[\t ]+$/gm, "");
		if (normalizedGeneratedSource !== generatedSource) {
			await fs.writeFile(generatedEntryPath, normalizedGeneratedSource, "utf8");
		}
	}
};

await normalizeGeneratedTypeScriptFiles(generatedClientDir);
