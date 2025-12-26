"use client";

import { observer, useLocalObservable } from "mobx-react-lite";
import { Text } from "../../ui/data-display/Text/Text";
import { Button } from "../../ui/inputs/Button/Button";
import { Input } from "../../ui/inputs/Input";
import { AuthLayout } from "../../ui/layouts/Auth/AuthLayout";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { useHandlers } from "./hooks";

interface LoginMutation {
	mutateAsync: (params: {
		data: { email: string; password: string };
	}) => Promise<unknown>;
	isPending: boolean;
}

interface Router {
	push: (path: string) => void;
}

interface LoginPageProps {
	loginMutation: LoginMutation;
	router: Router;
}

export const LoginPage = observer(
	({ loginMutation, router }: LoginPageProps) => {
		// 페이지 상태
		const state = useLocalObservable(() => ({
			email: "",
			password: "",
			errorMessage: "",
		}));

		// 핸들러는 hooks에서 가져옴
		const handlers = useHandlers({ state, loginMutation, router });

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
						onKeyDown={handlers.onKeyDownInput}
					/>
					<Input
						path="password"
						state={state}
						variant="flat"
						type="password"
						placeholder="비밀번호를 입력하세요"
						label="비밀번호"
						onKeyDown={handlers.onKeyDownInput}
					/>
				</VStack>

				{state.errorMessage && (
					<Text variant="error">{state.errorMessage}</Text>
				)}

				<Button
					color="primary"
					size="lg"
					fullWidth
					onPress={handlers.onClickLoginButton}
					isLoading={loginMutation.isPending}
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
