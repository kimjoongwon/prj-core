import { ApiPropertyOptional } from "@nestjs/swagger";

export class IdpAccountAccessGrantFormFieldMetaDto {
	@ApiPropertyOptional({ description: "필드 라벨", example: "Space" })
	label?: string;
}
