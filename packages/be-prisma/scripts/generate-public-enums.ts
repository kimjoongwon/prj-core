import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDMMF } from "@prisma/internals";

const schemaDirectory = path.resolve(__dirname, "../schema");
const outputPath = path.resolve(
	__dirname,
	"../../common-enum/src/generated/prisma-enums.ts",
);

async function readSchema(): Promise<string> {
	const schemaFiles = await readdir(schemaDirectory);
	const prismaFiles = schemaFiles.filter((file) => file.endsWith(".prisma")).sort();
	return (
		await Promise.all(
			prismaFiles.map((file) => readFile(path.join(schemaDirectory, file), "utf8")),
		)
	).join("\n\n");
}

function renderEnum(name: string, values: string[]): string {
	const entries = values
		.map((value) => `\t${value}: ${JSON.stringify(value)},`)
		.join("\n");
	return `export const ${name} = {\n${entries}\n} as const;\n\nexport type ${name} = (typeof ${name})[keyof typeof ${name}];`;
}

export async function renderPublicEnums(): Promise<string> {
	const dmmf = await getDMMF({ datamodel: await readSchema() });
	const enums = dmmf.datamodel.enums.map((definition) =>
		renderEnum(
			definition.name,
			definition.values.map((value) => value.name),
		),
	);
	return `/**\n * Prisma schema에서 DMMF로 생성된 공개 enum입니다.\n * 이 파일을 직접 수정하지 말고 be-prisma의 public:enums 스크립트를 실행하세요.\n */\n\n${enums.join("\n\n\n")}\n`;
}

async function generatePublicEnums(): Promise<void> {
	await mkdir(path.dirname(outputPath), { recursive: true });
	await writeFile(outputPath, await renderPublicEnums(), "utf8");
}

if (require.main === module) {
	generatePublicEnums().catch((error: unknown) => {
		console.error(error);
		process.exitCode = 1;
	});
}
