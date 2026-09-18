import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	NumberValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Folder의 DB 필드 타입과 공통 검증입니다. */
export class FolderSchema extends AbstractSchema {
	folderId!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdValidationOptional({
		nullable: true,
		description: "부모 폴더 ID (루트면 null)",
	})
	parentFolderId!: bigint | null;

	@StringValidation({ description: "폴더명" })
	name!: string;

	@StringValidation({ description: "전체 경로 (예: /images/2024)" })
	path!: string;

	@NumberValidation({ description: "정렬 순서", int: true })
	sortOrder!: number;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;
}
