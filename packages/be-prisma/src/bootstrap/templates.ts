import { templateSeedData } from "../../bootstrap/templates";
import type { PrismaClient } from "../generated/client/client";
import { Prisma } from "../generated/client/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function ensureBootstrapTemplates(
	db: DbClient,
): Promise<void> {
	console.log("\n========================================");
	console.log("Template 시드 데이터 삽입 중...");
	console.log("========================================");

	let createdCount = 0;
	let skippedCount = 0;

	for (const templateData of templateSeedData) {
		const existing = await db.template.findFirst({
			where: {
				code: templateData.code,
				type: templateData.type,
			},
		});

		if (!existing) {
			await db.template.create({
				data: {
					code: templateData.code,
					name: templateData.name,
					type: templateData.type,
					subject: templateData.subject ?? null,
					content: templateData.content,
					description: templateData.description ?? null,
					isActive: templateData.isActive,
					variables: {
						create: templateData.variables.map((variable) => ({
							name: variable.name,
							description: variable.description ?? null,
							defaultValue: variable.defaultValue ?? null,
							isRequired: variable.isRequired,
						})),
					},
				},
			});
			createdCount++;
			console.log(
				`  - Template 생성: ${templateData.code} (${templateData.name})`,
			);
		} else {
			skippedCount++;
			console.log(`  - Template 이미 존재: ${templateData.code}`);
		}
	}

	console.log(
		`✅ Template 시드 완료! (생성: ${createdCount}개, 스킵: ${skippedCount}개)`,
	);
}
