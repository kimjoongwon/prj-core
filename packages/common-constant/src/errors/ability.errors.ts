import { createEntityErrors } from "./create-errors";

export const ABILITY_ERRORS = createEntityErrors("권한", {
	ROLE_NOT_FOUND: "역할(Role)을 찾을 수 없습니다",
});
