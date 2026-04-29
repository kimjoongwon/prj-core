import { templateSeedData } from "../../bootstrap/data/templates";
import type { ReferenceDataMigration } from "./types";

const AUTH_TEMPLATE_CODES = new Set([
	"AUTH_EMAIL_VERIFICATION",
	"AUTH_PASSWORD_RESET",
	"AUTH_TEMPORARY_PASSWORD",
]);

export const authEmailTemplatesMigration: ReferenceDataMigration = {
	id: "20260323143000_auth-email-templates",
	description:
		"Ensure auth email templates exist for sign-up verification, password reset, and temporary password notifications.",
	sourcePath: __filename,
	async up(db) {
		for (const template of templateSeedData.filter((item) =>
			AUTH_TEMPLATE_CODES.has(item.code),
		)) {
			const existing = await db.template.findFirst({
				where: {
					code: template.code,
					type: template.type,
					removedAt: null,
				},
			});

			if (existing) {
				console.log(`  - auth template exists: ${template.code}`);
				continue;
			}

			await db.template.create({
				data: {
					code: template.code,
					name: template.name,
					type: template.type,
					subject: template.subject ?? null,
					content: template.content,
					description: template.description ?? null,
					isActive: template.isActive,
					variables: {
						create: template.variables.map((variable) => ({
							name: variable.name,
							description: variable.description ?? null,
							defaultValue: variable.defaultValue ?? null,
							isRequired: variable.isRequired,
						})),
					},
				},
			});

			console.log(`  - auth template created: ${template.code}`);
		}
	},
};
