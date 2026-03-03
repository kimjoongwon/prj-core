"use client";

// TODO: Orval codegen 후 아래 import로 교체
// import { useCreateCategory, useGetCategories } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import { Page, PageHeader, Section, VStack } from "@cocrepo/ui";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/** 카테고리 목록 항목 (상위 카테고리 선택용) */
interface CategoryOption {
	id: string;
	name: string;
}

/**
 * 역할 카테고리 등록 폼 상태
 */
interface CategoryFormState {
	name: string;
	parentId: string;
	errors: {
		name: string;
	};
}

/** API 호출 (Orval codegen 전 임시) */
function getCategories() {
	return customInstance<{ data: CategoryOption[] }>({
		url: "/api/v1/categories",
		method: "GET",
		params: { type: "Role" },
	});
}

/**
 * 역할 카테고리 등록 페이지 - 클라이언트 컴포넌트
 */
function RoleCategoryNewPageClient() {
	const router = useRouter();

	// 상위 카테고리 목록 (선택용)
	const { data: categoriesResponse } = useQuery({
		queryKey: ["/api/v1/categories", { type: "Role" }],
		queryFn: getCategories,
	});
	const categoryOptions = categoriesResponse?.data ?? [];

	// TODO: Orval codegen 후 useCreateCategory 으로 교체
	const { mutate: createCategory, isPending } = useMutation({
		mutationFn: (data: {
			name: string;
			parentId?: string | null;
			type: string;
		}) => customInstance({ url: "/api/v1/categories", method: "POST", data }),
		onSuccess: () => {
			router.push("/roles/categories" as Route);
		},
	});

	const state = useLocalObservable<CategoryFormState>(() => ({
		name: "",
		parentId: "",
		errors: {
			name: "",
		},
	}));

	const validate = (): boolean => {
		let isValid = true;

		if (!state.name.trim()) {
			state.errors.name = "카테고리명을 입력해주세요.";
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
		router.push("/roles/categories" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		createCategory({
			name: state.name,
			parentId: state.parentId || null,
			type: "Role",
		});
	};

	return (
		<Page
			mode="content"
			top={
				<PageHeader
					title="역할 카테고리 등록"
					description="새로운 역할 카테고리를 등록합니다."
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
				<Section mode="content">
					<div className="space-y-6 p-6">
						<Input
							label="카테고리명"
							placeholder="PLATFORM"
							value={state.name}
							onValueChange={(value) => {
								state.name = value.toUpperCase();
							}}
							isInvalid={!!state.errors.name}
							errorMessage={state.errors.name}
							isRequired
							maxLength={50}
							description="대문자로 입력하는 것을 권장합니다. (예: PLATFORM, WORKSPACE)"
						/>
						<Select
							label="상위 카테고리"
							placeholder="없음 (최상위)"
							selectedKeys={state.parentId ? [state.parentId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								state.parentId = selected || "";
							}}
							description="상위 카테고리를 선택합니다. 선택하지 않으면 최상위 카테고리로 등록됩니다."
						>
							{categoryOptions.map((option) => (
								<SelectItem key={option.id}>{option.name}</SelectItem>
							))}
						</Select>
						<div className="flex justify-end pt-4">
							<Button
								color="primary"
								startContent={<Save className="h-4 w-4" />}
								onPress={onClickSubmitButton}
								isLoading={isPending}
							>
								카테고리 등록
							</Button>
						</div>
					</div>
				</Section>
			</VStack>
		</Page>
	);
}

export default observer(RoleCategoryNewPageClient);
