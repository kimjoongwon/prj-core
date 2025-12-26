"use client";

import { observer } from "mobx-react-lite";
import type React from "react";

import { Text } from "../../ui/data-display/Text/Text";
import { Button } from "../../ui/inputs/Button/Button";
import { Input } from "../../ui/inputs/Input";
import { AuthLayout } from "../../ui/layouts/Auth/AuthLayout";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export interface State {
	email: string;
	password: string;
	errorMessage: string;
}

export interface LoginPageProps {
	state: State;
	onClickLoginButton: () => void;
	onKeyDownInput: (e: React.KeyboardEvent) => void;
	isLoading?: boolean;
}

export const LoginPage = observer(
	({
		state,
		onClickLoginButton,
		onKeyDownInput,
		isLoading = false,
	}: LoginPageProps) => {
		const formComponent = (
			<VStack fullWidth gap={8} className="p-4">
				<VStack fullWidth gap={2}>
					<Text variant="h3">관리자 로그인</Text>
					<Text variant="caption">
						계정 정보를 입력하여 관리자 페이지에 접속하세요.
					</Text>
				</VStack>

				<VStack fullWidth gap={4}>
					<Input
						path="email"
						state={state}
						variant="flat"
						type="email"
						placeholder="이메일을 입력하세요"
						label="이메일"
						onKeyDown={onKeyDownInput}
					/>
					<Input
						path="password"
						state={state}
						variant="flat"
						type="password"
						placeholder="비밀번호를 입력하세요"
						label="비밀번호"
						onKeyDown={onKeyDownInput}
					/>
				</VStack>

				{state.errorMessage && (
					<Text variant="error">{state.errorMessage}</Text>
				)}

				<Button
					color="primary"
					size="lg"
					fullWidth
					onPress={onClickLoginButton}
					isLoading={isLoading}
				>
					<Text variant="body1" className="text-white">
						로그인
					</Text>
				</Button>
			</VStack>
		);

		return <AuthLayout formComponent={formComponent} />;
	},
);
