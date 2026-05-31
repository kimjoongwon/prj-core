import { CreateAbilityDto } from "./create-ability/create-ability.dto";

/**
 * Ability 생성 입력 타입 (Service/UseCase용)
 *
 * DTO에서 roleId/userId를 추가한 형태입니다.
 * actionName/subjectName으로 지정 시 Service에서 ID로 변환됩니다.
 */
export type CreateAbilityInput = CreateAbilityDto & {
	roleId?: string;
	userId?: string;
};
