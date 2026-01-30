"use client";

import { observer } from "mobx-react-lite";
import type React from "react";
import { Button } from "../../inputs/Button/Button";
import { Input } from "../../inputs/Input";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export interface State {
	/** 이메일 */
	email: string;
	/** 비밀번호 */
	password: string;
	/** 에러 메시지 */
	errorMessage: string;
}

export interface LoginPageProps {
	/** 로그인 상태 객체 */
	state: State;
	/** 로그인 버튼 클릭 핸들러 */
	onClickLoginButton: () => void;
	/** 입력 필드 키다운 핸들러 (Enter 키 처리) */
	onKeyDownInput: (e: React.KeyboardEvent) => void;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 로그인 페이지 제목 (예: "관리자 로그인", "파트너 로그인") */
	title: string;
	/** 로그인 페이지 설명 문구 */
	caption: string;
}

/**
 * LoginPage 컴포넌트
 * 이메일/비밀번호 기반 로그인 페이지입니다.
 * 순수 UI 컴포넌트로, Layout은 Next.js layout.tsx에서 적용합니다.
 *
 * @example
 * ```tsx
 * const [state] = useState({ email: "", password: "", errorMessage: "" });
 *
 * <LoginPage
 *   state={state}
 *   title="관리자 로그인"
 *   caption="관리자 계정으로 로그인해주세요."
 *   onClickLoginButton={handleLogin}
 *   onKeyDownInput={(e) => e.key === "Enter" && handleLogin()}
 *   isLoading={isLoading}
 * />
 * ```
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
					<h3 className="text-2xl font-bold">{title}</h3>
					<span className="text-sm text-default-500">{caption}</span>
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
					<span className="text-sm font-medium text-danger">
						{state.errorMessage}
					</span>
				)}

				<Button
					color="primary"
					size="lg"
					fullWidth
					onPress={onClickLoginButton}
					isLoading={isLoading}
				>
					<span className="text-white">로그인</span>
				</Button>
			</VStack>
		);
	},
);
