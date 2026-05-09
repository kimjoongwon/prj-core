import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const allowedStatuses = new Set([
	"planned",
	"assigned",
	"implemented",
	"verified",
	"blocked",
]);
const skipDirs = new Set([
	".git",
	".next",
	".turbo",
	"dist",
	"node_modules",
	"coverage",
]);

const args = process.argv.slice(2);
const allowBlocked = args.includes("--allow-blocked");
const requestedPaths = args.filter((arg) => !arg.startsWith("--"));
const errors = [];
const warnings = [];
const summary = {
	ledgers: 0,
	items: 0,
	planned: 0,
	assigned: 0,
	implemented: 0,
	verified: 0,
	blocked: 0,
};

const toRelative = (filePath) => path.relative(rootDir, filePath) || ".";
const resolveRepoPath = (value) =>
	path.isAbsolute(value) ? value : path.join(rootDir, value);

const walk = (dir) => {
	if (!fs.existsSync(dir)) {
		return [];
	}

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (!skipDirs.has(entry.name)) {
				files.push(...walk(entryPath));
			}
			continue;
		}

		if (entry.name === "stage-ledger.json") {
			files.push(entryPath);
		}
	}

	return files;
};

const ledgerPaths =
	requestedPaths.length > 0
		? requestedPaths.map((filePath) => resolveRepoPath(filePath))
		: walk(path.join(rootDir, "apps"));

const readJson = (ledgerPath) => {
	try {
		return JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
	} catch (error) {
		errors.push(`${toRelative(ledgerPath)}: invalid JSON (${error.message})`);
		return null;
	}
};

const ensureStringArray = (ledgerPath, item, fieldName) => {
	const value = item[fieldName];

	if (!Array.isArray(value)) {
		errors.push(`${toRelative(ledgerPath)}:${item.id}: ${fieldName} must be an array`);
		return [];
	}

	const invalid = value.find((entry) => typeof entry !== "string");

	if (invalid !== undefined) {
		errors.push(
			`${toRelative(ledgerPath)}:${item.id}: ${fieldName} must contain only strings`,
		);
	}

	return value.filter((entry) => typeof entry === "string");
};

const validateItem = (ledgerPath, item, index) => {
	const label =
		item && typeof item.id === "string" && item.id.length > 0
			? item.id
			: `items[${index}]`;

	if (!item || typeof item !== "object" || Array.isArray(item)) {
		errors.push(`${toRelative(ledgerPath)}:${label}: item must be an object`);
		return;
	}

	if (typeof item.id !== "string" || item.id.length === 0) {
		errors.push(`${toRelative(ledgerPath)}:${label}: id is required`);
	}

	if (!Number.isInteger(item.stage)) {
		errors.push(`${toRelative(ledgerPath)}:${label}: stage must be an integer`);
	}

	if (typeof item.agent_type !== "string" || item.agent_type.length === 0) {
		errors.push(`${toRelative(ledgerPath)}:${label}: agent_type is required`);
	}

	if (typeof item.required !== "boolean") {
		errors.push(`${toRelative(ledgerPath)}:${label}: required must be boolean`);
	}

	if (!allowedStatuses.has(item.status)) {
		errors.push(
			`${toRelative(ledgerPath)}:${label}: status must be one of ${[
				...allowedStatuses,
			].join(", ")}`,
		);
		return;
	}

	summary.items += 1;
	summary[item.status] += 1;

	const sourceSpecs = ensureStringArray(ledgerPath, item, "source_spec");
	const expectedFiles = ensureStringArray(ledgerPath, item, "expected_files");
	const verification = ensureStringArray(ledgerPath, item, "verification");
	const isRequired = item.required === true;
	const isBlocked = item.status === "blocked";
	const isVerified = item.status === "verified";

	if (isRequired && item.status !== "verified") {
		if (isBlocked) {
			if (!allowBlocked) {
				errors.push(
					`${toRelative(ledgerPath)}:${label}: required item is blocked`,
				);
			}

			if (
				typeof item.blocked_reason !== "string" ||
				item.blocked_reason.trim().length === 0
			) {
				errors.push(
					`${toRelative(ledgerPath)}:${label}: blocked item needs blocked_reason`,
				);
			}
		} else {
			errors.push(
				`${toRelative(ledgerPath)}:${label}: required item is ${item.status}, not verified`,
			);
		}
	}

	if (isRequired && verification.length === 0) {
		warnings.push(
			`${toRelative(ledgerPath)}:${label}: required item has no verification command`,
		);
	}

	if (!isBlocked) {
		for (const sourceSpec of sourceSpecs) {
			if (!fs.existsSync(resolveRepoPath(sourceSpec))) {
				errors.push(`${toRelative(ledgerPath)}:${label}: missing source_spec ${sourceSpec}`);
			}
		}
	}

	if (isVerified) {
		for (const expectedFile of expectedFiles) {
			if (!fs.existsSync(resolveRepoPath(expectedFile))) {
				errors.push(
					`${toRelative(ledgerPath)}:${label}: missing expected_file ${expectedFile}`,
				);
			}
		}
	}
};

for (const ledgerPath of ledgerPaths) {
	if (!fs.existsSync(ledgerPath)) {
		errors.push(`${toRelative(ledgerPath)}: ledger file is missing`);
		continue;
	}

	const ledger = readJson(ledgerPath);

	if (!ledger) {
		continue;
	}

	summary.ledgers += 1;

	if (!Array.isArray(ledger.items)) {
		errors.push(`${toRelative(ledgerPath)}: items must be an array`);
		continue;
	}

	ledger.items.forEach((item, index) => validateItem(ledgerPath, item, index));
}

if (ledgerPaths.length === 0) {
	console.log("No stage-ledger.json files found.");
	process.exit(0);
}

if (warnings.length) {
	console.warn("Stage ledger warnings:");
	for (const warning of warnings) {
		console.warn(`- ${warning}`);
	}
}

if (errors.length) {
	console.error("Stage ledger check failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(
	`Stage ledger check passed: ${summary.ledgers} ledger(s), ${summary.items} item(s), ${summary.verified} verified, ${summary.blocked} blocked.`,
);
