import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderPublicEnums } from "./generate-public-enums";

const outputPath = path.resolve(
	__dirname,
	"../../common-enum/src/generated/prisma-enums.ts",
);
async function checkPublicEnums(): Promise<void> {
	const expectedSource = await renderPublicEnums();
	const actualSource = await readFile(outputPath, "utf8");

	if (actualSource !== expectedSource) {
		throw new Error(
			"공개 enum 생성물이 Prisma schema와 다릅니다. pnpm --filter @cocrepo/prisma public:enums를 실행하세요.",
		);
	}
}

checkPublicEnums().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
