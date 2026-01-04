"use client";

import { Button } from "../inputs/Button/Button";
import { Input } from "../inputs/Input";
import { Text } from "../ui/data-display/Text/Text";
import { VStack } from "../ui/surfaces/VStack/VStack";

export interface PasswordInputPageState {
	password: string;
	passwordConfirm: string;
	errorMessage: string;
}

export interface PasswordInputPageProps {
	state: PasswordInputPageState;
	onSubmit: () => void;
	isLoading?: boolean;
}

/**
 * PasswordInputPage 컴포넌트
 * 순수 UI 컴포넌트로, Layout은 포함하지 않습니다.
 * Layout은 반드시 Next.js layout.tsx에서 적용해야 합니다.
 */
export const PasswordInputPage = ({
	state,
	onSubmit,
	isLoading = false,
}: PasswordInputPageProps) => {
	return (
		<VStack fullWidth gap={8} className="p-4">
			<VStack fullWidth gap={2}>
				<Text variant="h3">비밀번호 설정</Text>
				<Text variant="caption">사용하실 비밀번호를 입력해주세요.</Text>
			</VStack>

			<VStack fullWidth gap={4}>
				<Input
					path="password"
					state={state}
					variant="flat"
					type="password"
					placeholder="비밀번호를 입력하세요"
					label="비밀번호"
				/>
				<Input
					path="passwordConfirm"
					state={state}
					variant="flat"
					type="password"
					placeholder="비밀번호를 다시 입력하세요"
					label="비밀번호 확인"
				/>
			</VStack>

			{state.errorMessage && <Text variant="error">{state.errorMessage}</Text>}

			<Button
				color="primary"
				size="lg"
				fullWidth
				onPress={onSubmit}
				isLoading={isLoading}
			>
				<Text variant="body1" className="text-white">
					다음
				</Text>
			</Button>
		</VStack>
	);
};
