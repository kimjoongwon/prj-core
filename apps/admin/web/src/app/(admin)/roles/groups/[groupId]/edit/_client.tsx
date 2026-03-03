"use client";

// TODO: Orval codegen 후 아래 import로 교체
// import { useGetGroupById, useUpdateGroup } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import { VStack } from "@cocrepo/ui";
import { Button, Input } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
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
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"역할 그룹 수정"}</h1><p>{"로딩 중..."}</p></div></div>
                <div className="flex items-center justify-center p-8">
                    <span className="text-default-500">로딩 중...</span>
                </div>
            </section>
        );
	}

	if (!group) {
		return (
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"역할 그룹 수정"}</h1><p>{"그룹을 찾을 수 없습니다."}</p></div></div>
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-default-500">그룹을 찾을 수 없습니다.</p>
                    <Button variant="flat" onPress={onClickListButton}>목록으로
                                            </Button>
                </div>
            </section>
        );
	}

	return (
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"역할 그룹 수정"}</h1>{`${group.label || group.name} 그룹을 수정합니다.` && <p>{`${group.label || group.name} 그룹을 수정합니다.`}</p>}</div><div>{<Button
                                    variant="light"
                                    startContent={<ArrowLeft className="h-4 w-4" />}
                                    onPress={onClickBackButton}>상세로 돌아가기
                                                    </Button>}</div></div>
            <VStack gap={4}>
                <section>
                    <div className="space-y-6 p-6">
                        <Input
                            label="그룹명"
                            value={state.name}
                            onValueChange={value => {
                                state.name = value.toUpperCase();
                            }}
                            isInvalid={!!state.errors.name}
                            errorMessage={state.errors.name}
                            isRequired
                            maxLength={50} />
                        <Input
                            label="라벨"
                            placeholder="표시 라벨"
                            value={state.label}
                            onValueChange={value => {
                                state.label = value;
                            }}
                            maxLength={100}
                            description="그룹의 표시 라벨입니다." />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="flat" onPress={onClickBackButton}>취소
                                                            </Button>
                            <Button
                                color="primary"
                                startContent={<Save className="h-4 w-4" />}
                                onPress={onClickSubmitButton}
                                isLoading={isPending}>저장
                                                            </Button>
                        </div>
                    </div>
                </section>
            </VStack>
        </section>
    );
}

export default observer(RoleGroupEditPageClient);
