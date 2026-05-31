import { Derivative } from "@cocrepo/entity";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { DerivativeDto } from "./derivative.dto";

/**
 * 파생 리소스 생성 DTO
 */
export class CreateDerivativeDto extends OmitType(DerivativeDto, [
	...COMMON_ENTITY_FIELDS,
] as const) {
	/**
	 * DTO -> Entity 변환
	 */
	toEntity(): Derivative {
		const derivative = new Derivative();
		derivative.spaceId = this.spaceId;
		derivative.assetId = this.assetId;
		derivative.kind = this.kind;
		derivative.profile = this.profile;
		derivative.storageKey = this.storageKey;
		derivative.mimeType = this.mimeType;
		derivative.sizeBytes = BigInt(this.sizeBytes);
		derivative.width = this.width ?? null;
		derivative.height = this.height ?? null;
		derivative.durationMs = this.durationMs ?? null;
		return derivative;
	}
}
