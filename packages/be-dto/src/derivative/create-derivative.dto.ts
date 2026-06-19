import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { DerivativeDto } from "./derivative.dto";

/**
 * 파생 리소스 생성 DTO
 */
export class CreateDerivativeDto extends OmitType(DerivativeDto, [
	...COMMON_ENTITY_FIELDS,
] as const) {}
