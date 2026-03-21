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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

interface RoleGroupEditPageClientProps {
	groupId: string;
}

interface GroupEditFormState {
	name: string;
	label: string;
	errors: {
		name: string;
	};
	isInitialized: boolean;
}

/** 그룹 상세 응답 타입 */
interface GroupDetail {
	id: string;
	name: string;
	label?: string | null;
	type: string;
}

/**
 * 역할 그룹 수정 페이지 - 클라이언트 컴포넌트
 */
function RoleGroupEditPageClient({ groupId }: RoleGroupEditPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	// TODO: Orval codegen 후 useGetGroupById(groupId) 로 교체
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/groups", groupId],
		queryFn: () =>
			customInstance<{ data: GroupDetail }>({
				url: `/api/v1/groups/${groupId}`,
				method: "GET",
			}),
	});
	const group = response?.data;

	// TODO: Orval codegen 후 useUpdateGroup 으로 교체
	const { mutate: updateGroup, isPending } = useMutation({
		mutationFn: (data: { name?: string; label?: string }) =>
			customInstance({
				url: `/api/v1/groups/${groupId}`,
				method: "PATCH",
				data,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/groups", groupId],
			});
			router.push(`/roles/groups/${groupId}` as Route);
		},
	});

	const state = useLocalObservable<GroupEditFormState>(() => ({
		name: "",
		label: "",
		errors: {
			name: "",
		},
		isInitialized: false,
	}));

	useEffect(() => {
		if (group && !state.isInitialized) {
			state.name = group.name;
			state.label = group.label || "";
			state.isInitialized = true;
		}
	}, [group, state]);

	const validate = (): boolean => {
		let isValid = true;

		if (!state.name.trim()) {
			state.errors.name = "그룹명을 입력해주세요.";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		return isValid;
	};

	const onClickBackButton = () => {
		router.push(`/roles/groups/${groupId}` as Route);
	};

	const onClickListButton = () => {
		router.push("/roles/groups" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		updateGroup({
			name: state.name,
			label: state.label || undefined,
		});
	};

	if (isLoading) {
		return (
			<FormPage
				top={<PageTitleBar title="역할 그룹 수정" description="로딩 중..." />}
			>
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

	if (!group) {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 그룹 수정"
						description="그룹을 찾을 수 없습니다."
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">그룹을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={onClickListButton}>
								목록으로
							</Button>
						</div>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	}

	return (
		<FormPage
			top={
				<PageTitleBar
					title="역할 그룹 수정"
					description={`${group.label || group.name} 그룹을 수정합니다.`}
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
			}
		>
			<FormPageSurface>
				<VStack gap={4}>
					<FormSectionCard>
						<div className="space-y-6">
							<Input
								label="그룹명"
								value={state.name}
								onValueChange={(value) => {
									state.name = value.toUpperCase();
								}}
								isInvalid={!!state.errors.name}
								errorMessage={state.errors.name}
								isRequired
								maxLength={50}
							/>
							<Input
								label="라벨"
								placeholder="표시 라벨"
								value={state.label}
								onValueChange={(value) => {
									state.label = value;
								}}
								maxLength={100}
								description="그룹의 표시 라벨입니다."
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

type RoleGroupEditPageParams = {
	groupId: string;
};

const RoleGroupEditPage = observer(function RoleGroupEditPage() {
	const { groupId } = useParams<RoleGroupEditPageParams>();

	return <RoleGroupEditPageClient groupId={groupId} />;
});

export default RoleGroupEditPage;
