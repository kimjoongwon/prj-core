"use client";

import { AlertTriangle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Typography } from "../../data-display/Typography";
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
						<Typography.Paragraph
							size="sm"
							weight="medium"
							className="text-danger"
						>
							{t(error)}
						</Typography.Paragraph>
						{errorDescription ? (
							<Typography.Paragraph
								size="sm"
								color="muted"
								className="mt-2"
							>
								{t(errorDescription)}
							</Typography.Paragraph>
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
