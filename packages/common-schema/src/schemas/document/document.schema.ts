import { AbstractSchema } from "../abstract.schema";

/** Document의 DB 필드 타입과 공통 검증입니다. */
export class DocumentSchema extends AbstractSchema {
	documentId!: string;

	pageCount!: number | null;

	wordCount!: number | null;

	author!: string | null;

	title!: string | null;

	subject!: string | null;

	keywords!: string | null;

	assetId!: bigint;
}
