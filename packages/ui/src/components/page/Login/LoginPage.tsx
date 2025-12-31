"use client";

import { observer } from "mobx-react-lite";
import type React from "react";
import { Text } from "../../ui/data-display/Text/Text";
import { Button } from "../../ui/inputs/Button/Button";
import { Input } from "../../ui/inputs/Input";
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
	/** 로그인 페이지 제목 (예: "관리자 로그인", "파트너 로그인") */
	title: string;
	/** 로그인 페이지 설명 문구 */
	caption: string;
}

/**
 * LoginPage 컴포넌트
 * 순수 UI 컴포넌트로, Layout은 포함하지 않습니다.
 * Layout은 반드시 Next.js layout.tsx에서 적용해야 합니다.
 */
export const LoginPage = observer(
	({
		state,
		onClickLoginButton,
		onKeyDownInput,
		isLoading = false,
		title,
		caption,
	}: LoginPageProps) => {
		return (
			<VStack fullWidth gap={8} className="p-4">
				<VStack fullWidth gap={2}>
					<Text variant="h3">{title}</Text>
					<Text variant="caption">{caption}</Text>
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
	},
);
