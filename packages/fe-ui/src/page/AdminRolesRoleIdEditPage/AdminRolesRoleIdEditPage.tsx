"use client";
import {
	type UpdateRoleDto,
	useGetRoleById,
	useUpdateRole,
} from "@cocrepo/api/core/roles";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Textarea } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

interface RoleEditPageClientProps {
	roleId: string;
}

/**
 * 역할 수정 폼 상태
 */
interface RoleEditFormState {
	displayName: string;
	description: string;
	errors: {
		displayName: string;
	};
	isInitialized: boolean;
}

/**
 * 역할 수정 페이지 - 클라이언트 컴포넌트
 */
function RoleEditPageClient({ roleId }: RoleEditPageClientProps) {
	const router = useRouter();

	// API 조회
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data;

	// 수정 Mutation
	const { mutate: updateRole, isPending } = useUpdateRole({
		mutation: {
			onSuccess: () => {
				router.push(`/roles/${roleId}` as Route);
			},
		},
	});

	// 폼 상태
	const state = useLocalObservable<RoleEditFormState>(() => ({
		displayName: "",
		description: "",
		errors: {
			displayName: "",
		},
		isInitialized: false,
	}));

	// 초기 데이터 설정
	useEffect(() => {
		if (role && !state.isInitialized) {
			state.displayName = role.displayName || "";
			state.description = role.description || "";
			state.isInitialized = true;
		}
	}, [role, state]);

	/**
	 * 폼 유효성 검사
	 */
	const validate = (): boolean => {
		let isValid = true;

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
		router.push(`/roles/${roleId}` as Route);
	};

	/**
	 * 목록으로 이동 핸들러
	 */
	const onClickListButton = () => {
		router.push("/roles" as Route);
	};

	/**
	 * 폼 제출 핸들러
	 */
	const onClickSubmitButton = () => {
		if (!validate()) {
			return;
		}

		const data: UpdateRoleDto = {
			displayName: state.displayName || undefined,
			description: state.description || undefined,
		};

		updateRole({ id: roleId, data });
	};

	if (isLoading) {
		return (
			<FormPage top={<PageTitleBar title="역할 수정" description="로딩 중..." />}>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex items-center justify-center p-8">
							<span className="text-default-500">로딩 중...</span>
						</div>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	}

	if (!role) {
		const pageHeader = (
			<PageTitleBar title="역할 수정" description="역할을 찾을 수 없습니다." />
		);

		return (
			<FormPage top={pageHeader}>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">역할을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={onClickListButton}>
								목록으로
							</Button>
						</div>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	}

	if (role.isSystem) {
		const pageHeader = (
			<PageTitleBar
				title="역할 수정"
				description="시스템 역할은 수정할 수 없습니다."
			/>
		);

		return (
			<FormPage top={pageHeader}>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">
								시스템 역할은 수정할 수 없습니다.
							</p>
							<Button variant="flat" onPress={onClickBackButton}>
								상세로 돌아가기
							</Button>
						</div>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	}

	const pageHeader = (
		<PageTitleBar
			title="역할 수정"
			description={`${role.displayName || role.name} 역할을 수정합니다.`}
			actions={
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					상세로 돌아가기
				</Button>
			}
		/>
	);

	return (
		<FormPage top={pageHeader}>
			<FormPageSurface>
				<VStack gap={4}>
					<FormSectionCard>
						<div className="space-y-6">
							<Input
								label="역할 식별자"
								value={role.name}
								isReadOnly
								isDisabled
								description="역할 식별자는 수정할 수 없습니다."
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
							<div className="flex justify-end gap-2 pt-4">
								<Button variant="flat" onPress={onClickBackButton}>
									취소
								</Button>
								<Button
									color="primary"
									startContent={<Save className="h-4 w-4" />}
									onPress={onClickSubmitButton}
									isLoading={isPending}
								>
									저장
								</Button>
							</div>
						</div>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		</FormPage>
	);
}

type RoleEditPageParams = {
	roleId: string;
};

const RoleEditPage = observer(function RoleEditPage() {
	const { roleId } = useParams<RoleEditPageParams>();

	return <RoleEditPageClient roleId={roleId} />;
});

export const AdminRolesRoleIdEditPage = RoleEditPage;

export default AdminRolesRoleIdEditPage;
