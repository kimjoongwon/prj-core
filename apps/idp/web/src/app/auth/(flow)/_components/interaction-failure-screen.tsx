"use client";

import { Alert, Auth, Button, HStack, useT } from "@cocrepo/ui";
import { AlertTriangle } from "lucide-react";
import { observer } from "mobx-react-lite";

const OIDC_ADMIN_LOGIN_START_PATH =
	"/api/v1/auth/oidc/login?clientId=admin-web";

export interface InteractionFailureScreenProps {
	/** 만료된 interaction(400/404)이면 다시 로그인으로, 아니면 뒤로 복구한다. */
	isExpired: boolean;
	message: string;
}

/**
 * interaction 조회에 실패한 로그인/동의 화면의 공용 실패 UI.
 * 기존 interaction 페이지의 error 모드와 같은 문구와 복구 동작을 유지한다.
 */
export const InteractionFailureScreen = observer(
	(props: InteractionFailureScreenProps) => {
		const t = useT();

		const onClickRecoveryButton = () => {
			if (props.isExpired) {
				window.location.href = OIDC_ADMIN_LOGIN_START_PATH;
				return;
			}

			if (window.history.length > 1) {
				window.history.back();
				return;
			}

			window.location.href = OIDC_ADMIN_LOGIN_START_PATH;
		};

		return (
			<Auth.Panel variant="danger">
				<Auth.PanelHeader
					icon={<AlertTriangle className="h-6 w-6 text-danger" />}
					title="인증을 이어갈 수 없습니다"
					titleClassName="text-danger"
					subtitle="세션이 만료되었거나 요청이 올바르지 않습니다."
				/>

				<Alert status="danger" description={props.message} />

				<HStack gap="block">
					<Button
						className="flex-1 font-semibold"
						variant="primary"
						onPress={onClickRecoveryButton}
					>
						{props.isExpired ? t("다시 로그인") : t("돌아가기")}
					</Button>
				</HStack>
			</Auth.Panel>
		);
	},
);

InteractionFailureScreen.displayName = "InteractionFailureScreen";
