"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action";
import { useT } from "../../i18n";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

export interface LoginRedirectScreenProps {
	errorMessage: string;
	isRedirecting: boolean;
	onClickRetry?: () => void;
}

export const LoginRedirectScreen = observer(
	({ errorMessage, isRedirecting, onClickRetry }: LoginRedirectScreenProps) => {
		const t = useT();

		if (isRedirecting) {
			return (
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/80 p-8">
					<VStack fullWidth gap="section" className="items-center text-center">
						<Spinner size="lg" />
						<p className="text-muted">{t("로그인 페이지로 이동 중...")}</p>
					</VStack>
				</SectionSurface>
			);
		}

		return (
			<SectionSurface className="rounded-2xl border-border/80 bg-surface/80 p-8">
				<VStack fullWidth gap="roomy" className="items-center">
					<VStack fullWidth gap="inline" className="text-center">
						<h3 className="text-2xl font-bold">{t("로그인 실패")}</h3>
						<p className="text-sm text-danger">{errorMessage}</p>
					</VStack>
					<Button
						color="primary"
						size="lg"
						fullWidth
						onPress={onClickRetry}
						isDisabled={!onClickRetry}
					>
						{t("다시 로그인")}
					</Button>
				</VStack>
			</SectionSurface>
		);
	},
);

LoginRedirectScreen.displayName = "LoginRedirectScreen";
