import { createDomainErrors } from "./create-errors";

export const ACTION_ERRORS = createDomainErrors("Action", {
  NOT_FOUND: "Action을 찾을 수 없습니다",
  SYSTEM_ACTION_MODIFY_NOT_ALLOWED: "시스템 Action은 수정할 수 없습니다",
  SYSTEM_ACTION_DELETE_NOT_ALLOWED: "시스템 Action은 삭제할 수 없습니다",
});
