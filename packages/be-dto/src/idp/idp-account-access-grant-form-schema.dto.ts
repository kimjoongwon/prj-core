import { ApiProperty } from "@nestjs/swagger";

export class IdpAccountAccessGrantFormSchemaDto {
	@ApiProperty({ description: "스키마 키", example: "idp-account-access" })
	key!: string;

	@ApiProperty({ description: "스키마 라벨", example: "접근 권한 부여" })
	label!: string;

	@ApiProperty({ description: "스키마 대상 경로", type: [String] })
	paths!: string[];
}
