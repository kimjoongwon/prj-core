"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Button } from "../../control";
import { VStack } from "../../rhythm";
import { Surface } from "../../surface";

export interface AdminAuthLoginPageProps {
	errorMessage: string;
	isRedirecting: boolean;
	onClickRetry?: () => void;
}

export const AdminAuthLoginPage = observer(
	({ errorMessage, isRedirecting, onClickRetry }: AdminAuthLoginPageProps) => {
		if (isRedirecting) {
			return (
				<Surface className="rounded-2xl border-divider/80 bg-content1/80 p-8">
					<VStack fullWidth gap="section" className="items-center text-center">
						<Spinner size="lg" />
						<p className="text-default-500">로그인 페이지로 이동 중...</p>
					</VStack>
				</Surface>
			);
		}

		return (
			<Surface className="rounded-2xl border-divider/80 bg-content1/80 p-8">
				<VStack fullWidth gap="roomy" className="items-center">
					<VStack fullWidth gap="inline" className="text-center">
						<h3 className="text-2xl font-bold">로그인 실패</h3>
						<p className="text-sm text-danger">{errorMessage}</p>
					</VStack>
					<Button
						color="primary"
						size="lg"
						fullWidth
						onPress={onClickRetry}
						isDisabled={!onClickRetry}
					>
						다시 로그인
					</Button>
				</VStack>
			</Surface>
		);
	},
);

AdminAuthLoginPage.displayName = "AdminAuthLoginPage";
