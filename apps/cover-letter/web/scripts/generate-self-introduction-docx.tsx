import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { renderToBuffer } from "@react-docx/core";
import { selfIntroduction } from "../src/content/self-introduction";
import { createSelfIntroductionDocument } from "../src/documents/createSelfIntroductionDocument";

const documentDirectory = new URL("../public/documents/", import.meta.url);
const documentPath = new URL(
	selfIntroduction.downloadFileName,
	documentDirectory,
);

await mkdir(documentDirectory, { recursive: true });
const documentBuffer = await renderToBuffer(
	createSelfIntroductionDocument(selfIntroduction),
);
await writeFile(documentPath, documentBuffer);
console.log(`완성된 자기소개서 생성: ${fileURLToPath(documentPath)}`);
