"use client";

import { useLogin } from "@cocrepo/api";
import { AuthLayout, Button, Input, Text, VStack } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const LoginPage = observer(() => {
	const router = useRouter();
	const loginMutation = useLogin();

	const state = useLocalObservable(() => ({
		email: "",
		password: "",
		errorMessage: "",
	}));

	const handleLogin = useCallback(async () => {
		state.errorMessage = "";

		if (!state.email || !state.password) {
			state.errorMessage = "이메일과 비밀번호를 입력해주세요.";
			return;
		}

		try {
			await loginMutation.mutateAsync({
				data: {
					email: state.email,
					password: state.password,
				},
			});

			// 로그인 성공 시 대시보드로 이동
			router.push("/");
		} catch (_error) {
			state.errorMessage =
				"로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
		}
	}, [loginMutation, router, state]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleLogin();
			}
		},
		[handleLogin],
	);

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
					onKeyDown={handleKeyDown}
				/>
				<Input
					path="password"
					state={state}
					variant="flat"
					type="password"
					placeholder="비밀번호를 입력하세요"
					label="비밀번호"
					onKeyDown={handleKeyDown}
				/>
			</VStack>

			{state.errorMessage && (
				<Text variant="error">{state.errorMessage}</Text>
			)}

			<Button
				color="primary"
				size="lg"
				fullWidth
				onPress={handleLogin}
				isLoading={loginMutation.isPending}
			>
				<Text variant="body1" className="text-white">
					로그인
				</Text>
			</Button>
		</VStack>
	);

	return <AuthLayout formComponent={formComponent} />;
});

export default LoginPage;
