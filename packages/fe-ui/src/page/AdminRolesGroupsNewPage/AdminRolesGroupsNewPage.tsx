"use client";
import { customInstance } from "@cocrepo/api/core/client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 역할 그룹 등록 폼 상태
 */
interface GroupFormState {
	name: string;
	label: string;
	errors: {
		name: string;
	};
}

/**
 * 역할 그룹 등록 페이지 - 클라이언트 컴포넌트
 */
function RoleGroupNewPageClient() {
	const router = useRouter();

	// TODO: Orval codegen 후 useCreateGroup 으로 교체
	const { mutate: createGroup, isPending } = useMutation({
		mutationFn: (data: { name: string; label?: string; type: string }) =>
			customInstance({ url: "/api/v1/groups", method: "POST", data }),
		onSuccess: () => {
			router.push("/roles/groups" as Route);
		},
	});

	const state = useLocalObservable<GroupFormState>(() => ({
		name: "",
		label: "",
		errors: {
			name: "",
		},
	}));

	const validate = (): boolean => {
		let isValid = true;

		if (!state.name.trim()) {
			state.errors.name = "그룹명을 입력해주세요.";
			isValid = false;
		} else if (state.name.length > 50) {
			state.errors.name = "50자 이하로 입력해주세요.";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		return isValid;
	};

	const onClickBackButton = () => {
		router.push("/roles/groups" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		createGroup({
			name: state.name,
			label: state.label || undefined,
			type: "Role",
		});
	};

	return (
		<FormPage
			top={
				<PageTitleBar
					title="역할 그룹 등록"
					description="새로운 역할 그룹을 등록합니다."
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
			<FormPageSurface>
				<VStack gap={4}>
					<FormSectionCard>
						<div className="space-y-6">
							<Input
								label="그룹명"
								placeholder="TRUSTED"
								value={state.name}
								onValueChange={(value) => {
									state.name = value.toUpperCase();
								}}
								isInvalid={!!state.errors.name}
								errorMessage={state.errors.name}
								isRequired
								maxLength={50}
								description="대문자로 입력하는 것을 권장합니다. (예: TRUSTED, STANDARD)"
							/>
							<Input
								label="라벨"
								placeholder="신뢰"
								value={state.label}
								onValueChange={(value) => {
									state.label = value;
								}}
								maxLength={100}
								description="그룹의 표시 라벨입니다."
							/>
							<div className="flex justify-end pt-4">
								<Button
									color="primary"
									startContent={<Save className="h-4 w-4" />}
									onPress={onClickSubmitButton}
									isLoading={isPending}
								>
									그룹 등록
								</Button>
							</div>
						</div>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		</FormPage>
	);
}

const RoleGroupNewPage = observer(function RoleGroupNewPage() {
	return <RoleGroupNewPageClient />;
});

export const AdminRolesGroupsNewPage = RoleGroupNewPage;

export default AdminRolesGroupsNewPage;
