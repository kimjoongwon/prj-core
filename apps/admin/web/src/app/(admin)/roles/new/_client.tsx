"use client";
import { type CreateRoleDto, useCreateRole } from "@cocrepo/api/core/roles";

import { Page, PageTitleBar, Section, VStack } from "@cocrepo/ui";
import { Button, Input, Textarea } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 역할 등록 폼 상태
 */
interface RoleFormState {
	name: string;
	displayName: string;
	description: string;
	errors: {
		name: string;
		displayName: string;
	};
}

/**
 * 역할 등록 페이지 - 클라이언트 컴포넌트
 */
function RoleNewPageClient() {
	const router = useRouter();

	// API Mutation
	const { mutate: createRole, isPending } = useCreateRole({
		mutation: {
			onSuccess: () => {
				router.push("/roles" as Route);
			},
		},
	});

	// 폼 상태
	const state = useLocalObservable<RoleFormState>(() => ({
		name: "",
		displayName: "",
		description: "",
		errors: {
			name: "",
			displayName: "",
		},
	}));

	/**
	 * 폼 유효성 검사
	 */
	const validate = (): boolean => {
		let isValid = true;

		// 이름 검사 (필수, 패턴: ^[A-Z][A-Z0-9_]*$)
		if (!state.name.trim()) {
			state.errors.name = "역할 식별자를 입력해주세요.";
			isValid = false;
		} else if (!/^[A-Z][A-Z0-9_]*$/.test(state.name)) {
			state.errors.name =
				"대문자로 시작하고, 대문자/숫자/밑줄만 사용 가능합니다. (예: CUSTOM_ROLE)";
			isValid = false;
		} else if (state.name.length > 50) {
			state.errors.name = "50자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		// 표시명 검사 (선택, 최대 50자)
		if (state.displayName && state.displayName.length > 50) {
			state.errors.displayName = "50자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.displayName = "";
		}

		return isValid;
	};

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/roles" as Route);
	};

	/**
	 * 폼 제출 핸들러
	 */
	const onClickSubmitButton = () => {
		if (!validate()) {
			return;
		}

		const data: CreateRoleDto = {
			name: state.name,
			displayName: state.displayName || undefined,
			description: state.description || undefined,
		};

		createRole({ data });
	};

	return (
		<Page
			top={
				<PageTitleBar
					title="역할 등록"
					description="새로운 역할을 등록합니다."
					actions={
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={onClickBackButton}
						>
							목록으로
						</Button>
					}
				/>
			}
		>
			<VStack gap={4}>
				<div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
					<p className="text-sm text-primary-700 dark:text-primary-400">
						<strong>참고:</strong> 역할 식별자는 대문자로 시작하고,
						대문자/숫자/밑줄만 사용할 수 있습니다. 등록 후에는 권한 설정
						페이지에서 상세 권한을 관리할 수 있습니다.
					</p>
				</div>
				<Section>
					<div className="space-y-6 p-6">
						<Input
							label="역할 식별자"
							placeholder="CUSTOM_ROLE"
							value={state.name}
							onValueChange={(value) => {
								state.name = value.toUpperCase();
							}}
							isInvalid={!!state.errors.name}
							errorMessage={state.errors.name}
							isRequired
							maxLength={50}
							description="대문자로 시작하고, 대문자/숫자/밑줄만 사용 가능합니다."
						/>
						<Input
							label="표시명"
							placeholder="사용자 정의 역할"
							value={state.displayName}
							onValueChange={(value) => {
								state.displayName = value;
							}}
							isInvalid={!!state.errors.displayName}
							errorMessage={state.errors.displayName}
							maxLength={50}
							description="사용자에게 보여질 역할 이름입니다."
						/>
						<Textarea
							label="설명"
							placeholder="역할에 대한 설명을 입력하세요."
							value={state.description}
							onValueChange={(value) => {
								state.description = value;
							}}
							maxLength={200}
							minRows={3}
						/>
						<div className="flex justify-end pt-4">
							<Button
								color="primary"
								startContent={<Save className="h-4 w-4" />}
								onPress={onClickSubmitButton}
								isLoading={isPending}
							>
								역할 등록
							</Button>
						</div>
					</div>
				</Section>
			</VStack>
		</Page>
	);
}

export default observer(RoleNewPageClient);
