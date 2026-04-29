import {
	getCurrentSpaceQueryKey as getCurrentSpaceQueryKeyWrapper,
	getCurrentSpace as getCurrentSpaceWrapper,
	setCurrentSpace as setCurrentSpaceWrapper,
	useGetCurrentSpace as useGetCurrentSpaceWrapper,
	useSetCurrentSpace as useSetCurrentSpaceWrapper,
} from "./current-space";

export * from "./auth";
export const getCurrentSpace = getCurrentSpaceWrapper;
export const getCurrentSpaceQueryKey = getCurrentSpaceQueryKeyWrapper;
export const setCurrentSpace = setCurrentSpaceWrapper;
export const useGetCurrentSpace = useGetCurrentSpaceWrapper;
export const useSetCurrentSpace = useSetCurrentSpaceWrapper;
export type { AuthAuditLogDto } from "../model/authAuditLogDto";
export { AuthAuditResult } from "../model/authAuditResult";
export type { EmailVerificationRequestedDto } from "../model/emailVerificationRequestedDto";
