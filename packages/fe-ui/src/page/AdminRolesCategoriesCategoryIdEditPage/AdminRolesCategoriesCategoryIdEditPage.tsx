"use client";
import { customInstance } from "@cocrepo/api/core/client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

interface RoleCategoryEditPageClientProps {
	categoryId: string;
}

interface CategoryEditFormState {
	name: string;
	parentId: string;
	errors: {
		name: string;
	};
	isInitialized: boolean;
}

/** 카테고리 상세 응답 타입 */
interface CategoryDetail {
	id: string;
	name: string;
	type: string;
	parentId?: string | null;
	children?: Array<{ id: string; name: string }>;
}

/** 카테고리 선택 옵션 */
interface CategoryOption {
	id: string;
	name: string;
}

/**
 * 역할 카테고리 수정 페이지 - 클라이언트 컴포넌트
 */
function RoleCategoryEditPageClient({
	categoryId,
}: RoleCategoryEditPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	// TODO: Orval codegen 후 useGetCategoryById(categoryId) 로 교체
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/categories", categoryId],
		queryFn: () =>
			customInstance<{ data: CategoryDetail }>({
				url: `/api/v1/categories/${categoryId}`,
				method: "GET",
			}),
	});
	const category = response?.data;

	// 상위 카테고리 선택 목록
	const { data: categoriesResponse } = useQuery({
		queryKey: ["/api/v1/categories", { type: "Role" }],
		queryFn: () =>
			customInstance<{ data: CategoryOption[] }>({
				url: "/api/v1/categories",
				method: "GET",
				params: { type: "Role" },
			}),
	});
	const allCategories = categoriesResponse?.data ?? [];

	// 자기 자신과 하위 카테고리는 상위 카테고리 후보에서 제외
	const descendantIds = new Set<string>();
	const collectDescendants = (id: string) => {
		descendantIds.add(id);
		if (category?.children) {
			for (const child of category.children) {
				descendantIds.add(child.id);
			}
		}
	};
	collectDescendants(categoryId);
	const categoryOptions = allCategories.filter((c) => !descendantIds.has(c.id));

	// TODO: Orval codegen 후 useUpdateCategory 으로 교체
	const { mutate: updateCategory, isPending } = useMutation({
		mutationFn: (data: { name?: string; parentId?: string | null }) =>
			customInstance({
				url: `/api/v1/categories/${categoryId}`,
				method: "PATCH",
				data,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/categories", categoryId],
			});
			router.push(`/roles/categories/${categoryId}` as Route);
		},
	});

	const state = useLocalObservable<CategoryEditFormState>(() => ({
		name: "",
		parentId: "",
		errors: {
			name: "",
		},
		isInitialized: false,
	}));

	useEffect(() => {
		if (category && !state.isInitialized) {
			state.name = category.name;
			state.parentId = category.parentId || "";
			state.isInitialized = true;
		}
	}, [category, state]);

	const validate = (): boolean => {
		let isValid = true;

		if (!state.name.trim()) {
			state.errors.name = "카테고리명을 입력해주세요.";
			isValid = false;
		} else {
			state.errors.name = "";
		}

		return isValid;
	};

	const onClickBackButton = () => {
		router.push(`/roles/categories/${categoryId}` as Route);
	};

	const onClickListButton = () => {
		router.push("/roles/categories" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		updateCategory({
			name: state.name,
			parentId: state.parentId || null,
		});
	};

	if (isLoading) {
		return (
			<FormPage
				top={
					<PageTitleBar title="역할 카테고리 수정" description="로딩 중..." />
				}
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

	if (!category) {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 카테고리 수정"
						description="카테고리를 찾을 수 없습니다."
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">카테고리를 찾을 수 없습니다.</p>
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
					title="역할 카테고리 수정"
					description={`${category.name} 카테고리를 수정합니다.`}
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
								label="카테고리명"
								value={state.name}
								onValueChange={(value) => {
									state.name = value.toUpperCase();
								}}
								isInvalid={!!state.errors.name}
								errorMessage={state.errors.name}
								isRequired
								maxLength={50}
							/>
							<Select
								label="상위 카테고리"
								placeholder="없음 (최상위)"
								selectedKeys={state.parentId ? [state.parentId] : []}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as string;
									state.parentId = selected || "";
								}}
								description="상위 카테고리를 변경합니다. 순환 참조는 서버에서 검증됩니다."
							>
								{categoryOptions.map((option) => (
									<SelectItem key={option.id}>{option.name}</SelectItem>
								))}
							</Select>
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

type RoleCategoryEditPageParams = {
	categoryId: string;
};

const RoleCategoryEditPage = observer(function RoleCategoryEditPage() {
	const { categoryId } = useParams<RoleCategoryEditPageParams>();

	return <RoleCategoryEditPageClient categoryId={categoryId} />;
});

export const AdminRolesCategoriesCategoryIdEditPage = RoleCategoryEditPage;

export default AdminRolesCategoriesCategoryIdEditPage;
