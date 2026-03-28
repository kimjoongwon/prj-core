"use client";
import {
	useAbortInteraction,
	useSubmitLogin,
} from "@cocrepo/api/idp/interaction";

import type { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import {
	OidcLoginForm,
	type LoginErrorResponse,
} from "../../../form/OidcLoginForm/OidcLoginForm";

export interface IdpLoginProps {
	/** OIDC 인터랙션 UID */
	uid: string;
	/** 클라이언트 정보 */
	client?: {
		clientId: string;
		name: string;
		logoUri?: string;
	} | null;
	/** DEV 모드 여부 */
	isDev?: boolean;
}

/**
 * IDP 로그인 Feature
 *
 * OidcLoginForm Widget에 실제 API 호출 로직을 연결합니다.
 */
export const IdpLogin = observer(
	({ uid, client, isDev = false }: IdpLoginProps) => {
		const loginMutation = useSubmitLogin();
		const abortMutation = useAbortInteraction();

		const handleSubmit = async (data: {
			email: string;
			password: string;
			remember: boolean;
		}): Promise<LoginErrorResponse | null> => {
			try {
				const result = await loginMutation.mutateAsync({
					uid,
					data,
				});
				window.location.href = result.redirectTo;
				return null;
			} catch (err) {
				const axiosError = err as AxiosError<LoginErrorResponse>;
				if (axiosError.response?.data) {
					return axiosError.response.data;
				}
				return {
					error: "NETWORK_ERROR",
					displayMessage: "서버와 통신할 수 없습니다.",
					hint: "잠시 후 다시 시도하거나 문제가 반복되면 관리자에게 문의하세요.",
				};
			}
		};

		const handleAbort = async () => {
			try {
				const result = await abortMutation.mutateAsync({ uid });
				if (result.redirectTo) {
					window.location.href = result.redirectTo;
				}
			} catch {
				// 에러 무시
			}
		};

		return (
			<OidcLoginForm
				onSubmit={handleSubmit}
				onAbort={handleAbort}
				client={client}
				isDev={isDev}
			/>
		);
	},
);

IdpLogin.displayName = "IdpLogin";
