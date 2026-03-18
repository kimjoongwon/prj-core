import type { PrismaClient } from "../generated/client/client";
import { Prisma } from "../generated/client/client";
import { templateSeedData } from "./data/templates";

type DbClient = PrismaClient | Prisma.TransactionClient;

/**
 * 기본 알림 템플릿을 create-only 방식으로 적재합니다.
 *
 * 템플릿은 운영 중 수동 수정 가능성이 높기 때문에, seed 재실행 시에도 기존 내용을
 * 덮어쓰지 않고 없는 템플릿만 보충하는 전략을 사용합니다.
 */
export async function ensureBootstrapTemplates(db: DbClient): Promise<void> {
	console.log("\n========================================");
	console.log("Template 시드 데이터 삽입 중...");
	console.log("========================================");

	let createdCount = 0;
	let skippedCount = 0;

	// Templates are bootstrap defaults, so this path is intentionally create-only
	// and avoids overwriting content that may already be curated in an env.
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
