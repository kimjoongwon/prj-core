import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const schemaDir = path.resolve(__dirname, "../schema");
const baseFile = "_base.prisma";

const rootByFile: Record<string, string> = {
	"category.prisma": "Category",
	"group.prisma": "Group",
	"tenancy.prisma": "Tenant",
	"content.prisma": "Content",
	"security-policy.prisma": "SecurityPolicy",
	"whitelist-entry.prisma": "WhitelistEntry",
	"auth-audit.prisma": "AuthAuditLog",
	"password-history.prisma": "PasswordHistory",
	"subject.prisma": "Subject",
	"action.prisma": "Action",
	"ability.prisma": "Ability",
	"grant.prisma": "Grant",
	"inquiry.prisma": "Inquiry",
	"inquiry-thread.prisma": "InquiryThread",
	"inquiry-ai.prisma": "AIAgentLog",
	"oidc-client.prisma": "OidcClient",
	"oidc-model.prisma": "OidcModel",
	"role.prisma": "Role",
	"safe.prisma": "SafeWallet",
	"space.prisma": "Space",
	"timeline.prisma": "Timeline",
	"routine.prisma": "Routine",
	"task.prisma": "Task",
	"template.prisma": "Template",
	"translation.prisma": "Translation",
	"user.prisma": "User",
	"asset.prisma": "Asset",
	"folder.prisma": "Folder",
	"album.prisma": "Album",
};

const expectedOwner: Record<string, string> = {
	Category: "category.prisma",
	CategoryTypes: "category.prisma",
	Group: "group.prisma",
	GroupTypes: "group.prisma",

	Tenant: "tenancy.prisma",
	Assignment: "tenancy.prisma",

	Post: "content.prisma",
	Content: "content.prisma",
	TextTypes: "content.prisma",

	SecurityPolicy: "security-policy.prisma",

	WhitelistType: "whitelist-entry.prisma",
	WhitelistEntry: "whitelist-entry.prisma",

	AuthAuditLog: "auth-audit.prisma",
	AuthAuditResult: "auth-audit.prisma",

	PasswordHistory: "password-history.prisma",

	Subject: "subject.prisma",
	Action: "action.prisma",
	Ability: "ability.prisma",
	Grant: "grant.prisma",

	Inquiry: "inquiry.prisma",
	InquiryTag: "inquiry.prisma",
	SentimentAnalysis: "inquiry.prisma",
	InquiryCategory: "inquiry.prisma",
	InquiryChannel: "inquiry.prisma",
	InquiryStatus: "inquiry.prisma",
	InquiryPriority: "inquiry.prisma",
	InquirySource: "inquiry.prisma",
	SentimentType: "inquiry.prisma",

	InquiryThread: "inquiry-thread.prisma",
	InquiryMessage: "inquiry-thread.prisma",
	InquiryParticipant: "inquiry-thread.prisma",
	InquiryAttachment: "inquiry-thread.prisma",
	InquiryParticipantRole: "inquiry-thread.prisma",
	SenderType: "inquiry-thread.prisma",
	ThreadStatus: "inquiry-thread.prisma",
	MessageContentType: "inquiry-thread.prisma",
	AttachmentFileType: "inquiry-thread.prisma",

	AIAgentLog: "inquiry-ai.prisma",
	AIAgentAction: "inquiry-ai.prisma",

	OidcClient: "oidc-client.prisma",
	OidcModel: "oidc-model.prisma",

	Role: "role.prisma",
	RoleAssociation: "role.prisma",
	RoleClassification: "role.prisma",

	SafeWallet: "safe.prisma",
	SafeTransaction: "safe.prisma",
	SafeConfirmation: "safe.prisma",

	Space: "space.prisma",
	SpaceClassification: "space.prisma",
	SpaceAssociation: "space.prisma",
	Ground: "space.prisma",

	Timeline: "timeline.prisma",
	Session: "timeline.prisma",
	Program: "timeline.prisma",
	SessionTypes: "timeline.prisma",
	RepeatCycleTypes: "timeline.prisma",
	RecurringDayOfWeek: "timeline.prisma",

	Routine: "routine.prisma",
	Activity: "routine.prisma",

	Task: "task.prisma",
	Exercise: "task.prisma",

	Template: "template.prisma",
	TemplateVariable: "template.prisma",
	TemplateType: "template.prisma",

	Translation: "translation.prisma",
	LanguageCode: "translation.prisma",

	User: "user.prisma",
	UserClassification: "user.prisma",
	UserAssociation: "user.prisma",
	Profile: "user.prisma",

	Asset: "asset.prisma",
	Image: "asset.prisma",
	Video: "asset.prisma",
	Document: "asset.prisma",
	Derivative: "asset.prisma",
	AssetKind: "asset.prisma",
	AssetStatus: "asset.prisma",
	DerivativeKind: "asset.prisma",

	Folder: "folder.prisma",

	Album: "album.prisma",
	AlbumEntry: "album.prisma",
};

function getNames(text: string, kind: "model" | "enum"): string[] {
	const pattern =
		kind === "model"
			? /^\s*model\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm
			: /^\s*enum\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
	const result: string[] = [];

	let match = pattern.exec(text);
	while (match) {
		result.push(match[1]);
		match = pattern.exec(text);
	}

	return result;
}

function countMatches(text: string, pattern: RegExp): number {
	const matches = text.match(pattern);
	return matches ? matches.length : 0;
}

function main(): void {
	if (!existsSync(schemaDir)) {
		console.error(`[schema:check] schema directory not found: ${schemaDir}`);
		process.exit(1);
	}

	const files = readdirSync(schemaDir)
		.filter((f) => f.endsWith(".prisma"))
		.sort();
	const textsByFile = new Map<string, string>();
	const declarations = new Map<string, { kind: "model" | "enum"; file: string }[]>();
	const errors: string[] = [];

	for (const file of files) {
		const fullPath = path.join(schemaDir, file);
		const text = readFileSync(fullPath, "utf-8");
		textsByFile.set(file, text);

		const generatorCount = countMatches(text, /^\s*generator\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm);
		const datasourceCount = countMatches(text, /^\s*datasource\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm);
		const invalidDisplayNameCount = countMatches(text, /@DisplayName|@displayname/g);

		if (file !== baseFile && (generatorCount > 0 || datasourceCount > 0)) {
			errors.push(`[${file}] generator/datasource is only allowed in ${baseFile}`);
		}
		if (invalidDisplayNameCount > 0) {
			errors.push(`[${file}] contains invalid displayName tag casing (@DisplayName or @displayname)`);
		}
		if (file !== baseFile && !rootByFile[file]) {
			errors.push(`[${file}] missing aggregate-root assignment in rootByFile`);
		}

		for (const modelName of getNames(text, "model")) {
			const list = declarations.get(modelName) ?? [];
			list.push({ kind: "model", file });
			declarations.set(modelName, list);
		}

		for (const enumName of getNames(text, "enum")) {
			const list = declarations.get(enumName) ?? [];
			list.push({ kind: "enum", file });
			declarations.set(enumName, list);
		}
	}

	const rootNames = new Set(Object.values(rootByFile));
	for (const [file, rootName] of Object.entries(rootByFile)) {
		const text = textsByFile.get(file);
		if (!text) {
			errors.push(`[${file}] missing schema file for aggregate root ${rootName}`);
			continue;
		}
		const models = getNames(text, "model");
		const rootsInFile = models.filter((name) => rootNames.has(name));
		if (rootsInFile.length !== 1) {
			errors.push(`[${file}] must contain exactly 1 aggregate root, found ${rootsInFile.length}`);
			continue;
		}
		if (rootsInFile[0] !== rootName) {
			errors.push(`[${file}] aggregate root must be ${rootName} but found ${rootsInFile[0]}`);
		}
	}

	const mergedText = Array.from(textsByFile.values()).join("\n");
	const totalGenerators = countMatches(mergedText, /^\s*generator\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm);
	const totalDatasources = countMatches(mergedText, /^\s*datasource\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm);

	if (totalGenerators !== 1) {
		errors.push(`expected exactly 1 generator block, found ${totalGenerators}`);
	}
	if (totalDatasources !== 1) {
		errors.push(`expected exactly 1 datasource block, found ${totalDatasources}`);
	}
	if (!textsByFile.has(baseFile)) {
		errors.push(`missing required base schema file: ${baseFile}`);
	}

	for (const [name, entries] of declarations.entries()) {
		if (entries.length > 1) {
			const filesWithDecl = entries.map((e) => e.file).join(", ");
			errors.push(`${name} is declared multiple times: ${filesWithDecl}`);
			continue;
		}
		const file = entries[0].file;
		const expected = expectedOwner[name];
		if (!expected) {
			errors.push(`${name} is declared in ${file} but missing from ownership map`);
			continue;
		}
		if (expected !== file) {
			errors.push(`${name} should be in ${expected} but found in ${file}`);
		}
	}

	for (const [name, ownerFile] of Object.entries(expectedOwner)) {
		if (!declarations.has(name)) {
			errors.push(`${name} is missing (expected in ${ownerFile})`);
		}
	}

	for (const [name, entries] of declarations.entries()) {
		if (entries[0].kind !== "enum") {
			continue;
		}
		const usageCount = countMatches(mergedText, new RegExp(`\\b${name}\\b`, "g"));
		if (usageCount <= 1) {
			errors.push(`enum ${name} is unused`);
		}
	}

	if (errors.length > 0) {
		console.error("[schema:check] FAILED");
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log(
		`[schema:check] OK (${files.length} files, ${declarations.size} declarations, aggregate-root ownership enforced)`,
	);
}

main();
