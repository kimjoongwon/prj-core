import { ApiProperty } from "@nestjs/swagger";

export class IdpAccountAccessGrantFormUiPathsDto {
	@ApiProperty({ description: "읽기 전용 경로 목록", type: [String] })
	readOnlyPaths!: string[];

	@ApiProperty({ description: "숨김 경로 목록", type: [String] })
	hiddenPaths!: string[];

	@ApiProperty({ description: "비활성 경로 목록", type: [String] })
	disabledPaths!: string[];
}
