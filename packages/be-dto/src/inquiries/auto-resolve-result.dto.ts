import {
	BooleanField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";

/**
 * 자동 해결 결과 DTO
 */
export class AutoResolveResultDto {
	@StringField({ description: "결과 상태 (success/partial/failed)" })
	status!: string;

	@StringField({ description: "생성된 응답 내용" })
	response!: string;

	@NumberField({ description: "신뢰도 점수 (0.0 ~ 1.0)" })
	confidence!: number;

	@BooleanField({ description: "자동 해결 적용 여부" })
	applied!: boolean;

	@StringField({ nullable: true, description: "실패 사유" })
	reason!: string | null;
}
