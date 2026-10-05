import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * Subject 응답 DTO (DMMF 기반)
 */
export class SubjectResponseDto {
	@ApiProperty({
		description: "Subject 이름 (Prisma 모델명)",
		example: "User",
	})
	@Expose()
	name!: string;

	@ApiProperty({
		description: "Subject 표시명 (@displayName 주석)",
		example: "사용자",
		nullable: true,
	})
	@Expose()
	displayName!: string | null;

	@ApiProperty({
		description: "필드 수",
		example: 10,
	})
	@Expose()
	fieldCount!: number;
}
