import { createDomainErrors } from "./create-errors";

export const ACTION_ERRORS = createDomainErrors("Action", {
	NOT_FOUND: "Action을 찾을 수 없습니다",
});
