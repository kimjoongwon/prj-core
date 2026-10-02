"use client";

import { AlertTriangle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Button } from "../../input";
import { Auth } from "../../layout/Auth";
import { VStack } from "../../rhythm";

export interface AuthErrorScreenProps {
	error: string;
	errorDescription: string;
	onClickBack: () => void;
}

export const AuthErrorScreen = observer(
	({ error, errorDescription, onClickBack }: AuthErrorScreenProps) => {
		const t = useT();

		return (
			<Auth.Panel variant="danger">
				<Auth.PanelHeader
					icon={<AlertTriangle className="h-6 w-6 text-danger" />}
					title="오류 발생"
					titleClassName="text-danger"
				/>

				<VStack gap="section">
					<div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
						<p className="text-sm font-medium text-danger">{t(error)}</p>
						{errorDescription ? (
							<p className="mt-2 text-sm text-muted">{t(errorDescription)}</p>
						) : null}
					</div>
				</VStack>

				<div className="mt-6 text-center">
					<Button variant="ghost" onPress={onClickBack}>
						{t("돌아가기")}
					</Button>
				</div>
			</Auth.Panel>
		);
	},
);

AuthErrorScreen.displayName = "AuthErrorScreen";
