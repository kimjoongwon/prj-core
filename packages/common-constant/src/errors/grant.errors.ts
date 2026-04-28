import { createDomainErrors } from "./create-errors";

export const GRANT_ERRORS = createDomainErrors("Grant", {
	NOT_FOUND: "Grant를 찾을 수 없습니다",
	ROLE_NOT_FOUND: "Role을 찾을 수 없습니다",
	USER_NOT_FOUND: "User를 찾을 수 없습니다",
	ABILITY_NOT_FOUND: "Ability를 찾을 수 없습니다",
	DUPLICATE_GRANT: "이미 동일한 Grant가 존재합니다",
});
