import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const schemaDir = path.resolve(__dirname, "../schema");
const baseFile = "_base.prisma";

const schemaOwnerByFile: Record<string, string> = {
	"access-control/ability.prisma": "Ability",
	"access-control/action.prisma": "Action",
	"access-control/policy.prisma": "Policy",
	"access-control/role.prisma": "Role",
	"access-control/subject.prisma": "Subject",
	"asset/album.prisma": "Album",
	"asset/asset.prisma": "Asset",
	"asset/folder.prisma": "Folder",
	"auth/auth-audit.prisma": "AuthAuditLog",
	"auth/password-history.prisma": "PasswordHistory",
	"auth/security-policy.prisma": "SecurityPolicy",
	"auth/whitelist-entry.prisma": "WhitelistEntry",
	"content/content.prisma": "Content",
	"content/template.prisma": "Template",
	"content/translation.prisma": "Translation",
	"identity/space.prisma": "Space",
	"identity/tenant-access-request.prisma": "TenantAccessRequest",
	"identity/tenant.prisma": "Tenant",
	"identity/tenant-access-request.prisma": "TenantAccessRequest",
	"identity/user.prisma": "User",
	"inquiry/inquiry-ai.prisma": "AIAgentLog",
	"inquiry/inquiry-thread.prisma": "InquiryThread",
	"inquiry/inquiry.prisma": "Inquiry",
	"oidc/oidc-client.prisma": "OidcClient",
	"oidc/oidc-model.prisma": "OidcModel",
	"platform/reference-data-migration.prisma": "ReferenceDataMigrationHistory",
	"scheduling/routine.prisma": "Routine",
	"scheduling/task.prisma": "Task",
	"scheduling/timeline.prisma": "Timeline",
	"taxonomy/category.prisma": "Category",
	"taxonomy/group.prisma": "Group",
	"wallet/safe.prisma": "SafeWallet",
};

const aggregateRootByFile: Record<string, string> = {
	"access-control/ability.prisma": "Ability",
	"access-control/action.prisma": "Action",
	"access-control/policy.prisma": "Policy",
	"access-control/role.prisma": "Role",
	"access-control/subject.prisma": "Subject",
	"asset/album.prisma": "Album",
	"asset/asset.prisma": "Asset",
	"asset/folder.prisma": "Folder",
	"auth/security-policy.prisma": "SecurityPolicy",
	"auth/whitelist-entry.prisma": "WhitelistEntry",
	"content/content.prisma": "Content",
	"content/template.prisma": "Template",
	"content/translation.prisma": "Translation",
	"identity/space.prisma": "Space",
	"identity/tenant-access-request.prisma": "TenantAccessRequest",
	"identity/tenant.prisma": "Tenant",
	"identity/tenant-access-request.prisma": "TenantAccessRequest",
	"identity/user.prisma": "User",
	"inquiry/inquiry.prisma": "Inquiry",
	"oidc/oidc-client.prisma": "OidcClient",
	"oidc/oidc-model.prisma": "OidcModel",
	"platform/reference-data-migration.prisma": "ReferenceDataMigrationHistory",
	"scheduling/routine.prisma": "Routine",
	"scheduling/task.prisma": "Task",
	"scheduling/timeline.prisma": "Timeline",
	"taxonomy/category.prisma": "Category",
	"taxonomy/group.prisma": "Group",
	"wallet/safe.prisma": "SafeWallet",
};

const expectedOwner: Record<string, string> = {
	Category: "taxonomy/category.prisma",
	CategoryTypes: "taxonomy/category.prisma",
	Group: "taxonomy/group.prisma",
	GroupTypes: "taxonomy/group.prisma",

	Tenant: "identity/tenant.prisma",
	Assignment: "identity/tenant.prisma",

	TenantAccessRequest: "identity/tenant-access-request.prisma",
	TenantAccessRequestStatus: "identity/tenant-access-request.prisma",
	TenantAccessRequest: "identity/tenant-access-request.prisma",
	TenantAccessRequestStatus: "identity/tenant-access-request.prisma",

	Post: "content/content.prisma",
	Content: "content/content.prisma",
	TextTypes: "content/content.prisma",

	SecurityPolicy: "auth/security-policy.prisma",

	WhitelistType: "auth/whitelist-entry.prisma",
	WhitelistEntry: "auth/whitelist-entry.prisma",

	AuthAuditLog: "auth/auth-audit.prisma",
	AuthAuditResult: "auth/auth-audit.prisma",

	PasswordHistory: "auth/password-history.prisma",

	Subject: "access-control/subject.prisma",
	Action: "access-control/action.prisma",
	Ability: "access-control/ability.prisma",
	Policy: "access-control/policy.prisma",
	PolicyAbility: "access-control/policy.prisma",
	RolePolicy: "access-control/policy.prisma",
	UserPolicy: "access-control/policy.prisma",

	Inquiry: "inquiry/inquiry.prisma",
	InquiryTag: "inquiry/inquiry.prisma",
	SentimentAnalysis: "inquiry/inquiry.prisma",
	InquiryCategory: "inquiry/inquiry.prisma",
	InquiryChannel: "inquiry/inquiry.prisma",
	InquiryStatus: "inquiry/inquiry.prisma",
	InquiryPriority: "inquiry/inquiry.prisma",
	InquirySource: "inquiry/inquiry.prisma",
	SentimentType: "inquiry/inquiry.prisma",

	InquiryThread: "inquiry/inquiry-thread.prisma",
	InquiryMessage: "inquiry/inquiry-thread.prisma",
	InquiryParticipant: "inquiry/inquiry-thread.prisma",
	InquiryAttachment: "inquiry/inquiry-thread.prisma",
	InquiryParticipantRole: "inquiry/inquiry-thread.prisma",
	SenderType: "inquiry/inquiry-thread.prisma",
	ThreadStatus: "inquiry/inquiry-thread.prisma",
	MessageContentType: "inquiry/inquiry-thread.prisma",
	AttachmentFileType: "inquiry/inquiry-thread.prisma",

	AIAgentLog: "inquiry/inquiry-ai.prisma",
	AIAgentAction: "inquiry/inquiry-ai.prisma",

	OidcClient: "oidc/oidc-client.prisma",
	OidcModel: "oidc/oidc-model.prisma",
	ReferenceDataMigrationHistory: "platform/reference-data-migration.prisma",

	Role: "access-control/role.prisma",
	RoleAssociation: "access-control/role.prisma",
	RoleClassification: "access-control/role.prisma",

	SafeWallet: "wallet/safe.prisma",
	SafeTransaction: "wallet/safe.prisma",
	SafeConfirmation: "wallet/safe.prisma",

	Space: "identity/space.prisma",
	SpaceClassification: "identity/space.prisma",
	SpaceAssociation: "identity/space.prisma",
	Ground: "identity/space.prisma",

	Timeline: "scheduling/timeline.prisma",
	Session: "scheduling/timeline.prisma",
	Program: "scheduling/timeline.prisma",
	ProgramActivity: "scheduling/timeline.prisma",
	SessionTypes: "scheduling/timeline.prisma",
	RepeatCycleTypes: "scheduling/timeline.prisma",
	RecurringDayOfWeek: "scheduling/timeline.prisma",

	Routine: "scheduling/routine.prisma",
	Activity: "scheduling/routine.prisma",

	Task: "scheduling/task.prisma",
	Exercise: "scheduling/task.prisma",

	Template: "content/template.prisma",
	TemplateVariable: "content/template.prisma",
	TemplateType: "content/template.prisma",

	Translation: "content/translation.prisma",
	LanguageCode: "content/translation.prisma",

	User: "identity/user.prisma",
	UserClassification: "identity/user.prisma",
	UserAssociation: "identity/user.prisma",
	Profile: "identity/user.prisma",

	Asset: "asset/asset.prisma",
	Image: "asset/asset.prisma",
	Video: "asset/asset.prisma",
	Document: "asset/asset.prisma",
	Derivative: "asset/asset.prisma",
	AssetKind: "asset/asset.prisma",
	AssetStatus: "asset/asset.prisma",
	DerivativeKind: "asset/asset.prisma",

	Folder: "asset/folder.prisma",

	Album: "asset/album.prisma",
	AlbumEntry: "asset/album.prisma",
};

function normalizeRelativePath(filePath: string): string {
	return filePath.split(path.sep).join("/");
}

function listPrismaFiles(dir: string, rootDir: string = dir): string[] {
	const results: string[] = [];
	const entries = readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...listPrismaFiles(fullPath, rootDir));
			continue;
		}
		if (entry.isFile() && entry.name.endsWith(".prisma")) {
			results.push(normalizeRelativePath(path.relative(rootDir, fullPath)));
		}
	}

	return results.sort((left, right) => {
		if (left === baseFile) {
			return -1;
		}
		if (right === baseFile) {
			return 1;
		}
		return left.localeCompare(right);
	});
}

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

function getMarkedModels(
	text: string,
	marker: "schema-owner" | "aggregate-root",
): string[] {
	const pattern =
		/((?:^\s*\/\/[^\n]*\n)+)\s*model\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
	const result: string[] = [];

	let match = pattern.exec(text);
	while (match) {
		const documentation = match[1];
		const modelName = match[2];

		if (new RegExp(`@${marker}:\\s*true\\b`).test(documentation)) {
			result.push(modelName);
		}

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

	const files = listPrismaFiles(schemaDir);
	const textsByFile = new Map<string, string>();
	const declarations = new Map<
		string,
		{ kind: "model" | "enum"; file: string }[]
	>();
	const errors: string[] = [];

	for (const file of files) {
		const fullPath = path.join(schemaDir, file);
		const text = readFileSync(fullPath, "utf-8");
		textsByFile.set(file, text);

		const generatorCount = countMatches(
			text,
			/^\s*generator\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm,
		);
		const datasourceCount = countMatches(
			text,
			/^\s*datasource\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm,
		);
		const invalidDisplayNameCount = countMatches(
			text,
			/@DisplayName|@displayname/g,
		);
		const schemaOwnerModels = getMarkedModels(text, "schema-owner");
		const aggregateRootModels = getMarkedModels(text, "aggregate-root");
		const expectedSchemaOwner = schemaOwnerByFile[file];
		const expectedAggregateRoot = aggregateRootByFile[file];

		if (file !== baseFile && (generatorCount > 0 || datasourceCount > 0)) {
			errors.push(
				`[${file}] generator/datasource is only allowed in ${baseFile}`,
			);
		}
		if (invalidDisplayNameCount > 0) {
			errors.push(
				`[${file}] contains invalid displayName tag casing (@DisplayName or @displayname)`,
			);
		}
		if (file !== baseFile && !expectedSchemaOwner) {
			errors.push(
				`[${file}] missing schema-owner assignment in schemaOwnerByFile`,
			);
		}
		if (
			file === baseFile &&
			(schemaOwnerModels.length > 0 || aggregateRootModels.length > 0)
		) {
			errors.push(
				`[${file}] must not declare @schema-owner: true or @aggregate-root: true`,
			);
		}
		if (file !== baseFile && schemaOwnerModels.length !== 1) {
			errors.push(
				`[${file}] must contain exactly 1 @schema-owner: true model, found ${schemaOwnerModels.length}`,
			);
		}
		if (
			file !== baseFile &&
			expectedSchemaOwner &&
			schemaOwnerModels.length === 1 &&
			schemaOwnerModels[0] !== expectedSchemaOwner
		) {
			errors.push(
				`[${file}] schema-owner marker must be on ${expectedSchemaOwner} but found ${schemaOwnerModels[0]}`,
			);
		}
		if (file !== baseFile && aggregateRootModels.length > 1) {
			errors.push(
				`[${file}] must contain at most 1 @aggregate-root: true model, found ${aggregateRootModels.length}`,
			);
		}
		if (
			file !== baseFile &&
			!expectedAggregateRoot &&
			aggregateRootModels.length > 0
		) {
			errors.push(`[${file}] must not declare @aggregate-root: true`);
		}
		if (
			file !== baseFile &&
			expectedAggregateRoot &&
			aggregateRootModels.length !== 1
		) {
			errors.push(
				`[${file}] must contain exactly 1 @aggregate-root: true model, found ${aggregateRootModels.length}`,
			);
		}
		if (
			file !== baseFile &&
			expectedAggregateRoot &&
			aggregateRootModels.length === 1 &&
			aggregateRootModels[0] !== expectedAggregateRoot
		) {
			errors.push(
				`[${file}] aggregate-root marker must be on ${expectedAggregateRoot} but found ${aggregateRootModels[0]}`,
			);
		}
		if (
			file !== baseFile &&
			schemaOwnerModels.length === 1 &&
			aggregateRootModels.length === 1 &&
			schemaOwnerModels[0] !== aggregateRootModels[0]
		) {
			errors.push(
				`[${file}] @aggregate-root: true must also be the @schema-owner: true model`,
			);
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

	const mergedText = Array.from(textsByFile.values()).join("\n");
	const totalGenerators = countMatches(
		mergedText,
		/^\s*generator\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm,
	);
	const totalDatasources = countMatches(
		mergedText,
		/^\s*datasource\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/gm,
	);

	if (totalGenerators !== 1) {
		errors.push(`expected exactly 1 generator block, found ${totalGenerators}`);
	}
	if (totalDatasources !== 1) {
		errors.push(
			`expected exactly 1 datasource block, found ${totalDatasources}`,
		);
	}
	if (!textsByFile.has(baseFile)) {
		errors.push(`missing required base schema file: ${baseFile}`);
	}

	for (const [name, entries] of declarations.entries()) {
		if (entries.length > 1) {
			const filesWithDecl = entries.map((entry) => entry.file).join(", ");
			errors.push(`${name} is declared multiple times: ${filesWithDecl}`);
			continue;
		}
		const file = entries[0].file;
		const expected = expectedOwner[name];
		if (!expected) {
			errors.push(
				`${name} is declared in ${file} but missing from ownership map`,
			);
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
		const usageCount = countMatches(
			mergedText,
			new RegExp(`\\b${name}\\b`, "g"),
		);
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
		`[schema:check] OK (${files.length} files, ${declarations.size} declarations, schema-owner + aggregate-root semantics enforced)`,
	);
}

main();
