import { spawn } from "node:child_process";
import { statSync } from "node:fs";

import {
	adminAppDir,
	collectPageFiles,
	collectRouteMetaFiles,
	generateAdminRouteCatalog,
	packageDir,
} from "./generate-admin-route-catalog.mjs";

const POLL_INTERVAL_MS = Number(process.env.ADMIN_ROUTE_META_POLL_MS ?? 1000);

function createRouteDefinitionSignature() {
	const trackedFiles = [
		...collectPageFiles(adminAppDir),
		...collectRouteMetaFiles(adminAppDir),
	].sort((left, right) => left.localeCompare(right));

	return trackedFiles
		.map((filePath) => {
			const stat = statSync(filePath);
			return `${filePath}:${stat.size}:${stat.mtimeMs}`;
		})
		.join("|");
}

let generationInFlight = false;
let generationQueued = false;

async function runGenerator(reason) {
	if (generationInFlight) {
		generationQueued = true;
		return;
	}

	generationInFlight = true;

	try {
		generateAdminRouteCatalog();
		console.log(`[admin-route-meta] regenerated (${reason})`);
	} catch (error) {
		console.error("[admin-route-meta] generation failed");
		console.error(error);
	} finally {
		generationInFlight = false;
		if (generationQueued) {
			generationQueued = false;
			await runGenerator("queued-change");
		}
	}
}

await runGenerator("startup");
let previousSignature = createRouteDefinitionSignature();

const pollTimer = setInterval(async () => {
	try {
		const nextSignature = createRouteDefinitionSignature();
		if (nextSignature === previousSignature) {
			return;
		}

		previousSignature = nextSignature;
		await runGenerator("route-tree-change");
	} catch (error) {
		console.error("[admin-route-meta] polling failed");
		console.error(error);
	}
}, POLL_INTERVAL_MS);

const tscProcess = spawn(
	process.platform === "win32" ? "pnpm.cmd" : "pnpm",
	["exec", "tsc", "--build", "--watch"],
	{
		stdio: "inherit",
		cwd: packageDir,
	},
);

function shutdown(signal) {
	clearInterval(pollTimer);
	if (!tscProcess.killed) {
		tscProcess.kill(signal);
	}
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

tscProcess.on("exit", (code) => {
	clearInterval(pollTimer);
	process.exit(code ?? 0);
});
