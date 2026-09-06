import type { Folder as PrismaFolder } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	NumberValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Folder의 DB 필드 타입과 공통 검증입니다. */
export class FolderSchema extends AbstractSchema implements PrismaFolder {
	folderId!: PrismaFolder["folderId"];

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: PrismaFolder["spaceId"];

	@BigIntIdValidationOptional({
		nullable: true,
		description: "부모 폴더 ID (루트면 null)",
	})
	parentFolderId!: PrismaFolder["parentFolderId"];

	@StringValidation({ description: "폴더명" })
	name!: PrismaFolder["name"];

	@StringValidation({ description: "전체 경로 (예: /images/2024)" })
	path!: PrismaFolder["path"];

	@NumberValidation({ description: "정렬 순서", int: true })
	sortOrder!: PrismaFolder["sortOrder"];

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaFolder["createdById"];
}
