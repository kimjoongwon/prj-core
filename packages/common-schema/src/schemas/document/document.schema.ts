import type { Document as PrismaDocument } from "@cocrepo/prisma";
import { AbstractSchema } from "../abstract.schema";

/** Document의 DB 필드 타입과 공통 검증입니다. */
export class DocumentSchema extends AbstractSchema implements PrismaDocument {
	documentId!: PrismaDocument["documentId"];

	pageCount!: PrismaDocument["pageCount"];

	wordCount!: PrismaDocument["wordCount"];

	author!: PrismaDocument["author"];

	title!: PrismaDocument["title"];

	subject!: PrismaDocument["subject"];

	keywords!: PrismaDocument["keywords"];

	assetId!: PrismaDocument["assetId"];
}
