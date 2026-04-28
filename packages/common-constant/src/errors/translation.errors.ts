import { createDomainErrors } from "./create-errors";

export const TRANSLATION_ERRORS = createDomainErrors("번역", {
	DUPLICATE_KEY: "이미 존재하는 번역 키입니다",
});
