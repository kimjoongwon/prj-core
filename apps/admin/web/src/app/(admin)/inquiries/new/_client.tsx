"use client";

import { getUsers } from "@cocrepo/api";
import type { AIFormSuggestion, CustomerInfo } from "@cocrepo/ui";
import { InquiryForm, PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useAIClassification } from "./hooks/useAIClassification";
import { useHandlers } from "./hooks/useHandlers";

/**
 * 문의 접수 페이지 - 클라이언트 컴포넌트
 *
 * @requires Orval API 훅 생성 후 아래와 같이 변경:
 * 1. useGetUsers 훅으로 고객 검색
 * 2. onSearchCustomer에서 API 호출
 */
function InquiriesNewPageClient() {
	const router = useRouter();

	// 로컬 상태 관리
	const state = useLocalObservable(() => ({
		isSubmitting: false,
		aiSuggestion: null as AIFormSuggestion | null,
		isAiLoading: false,
	}));

	// AI 분류 훅
	const aiClassification = useAIClassification({
		onResult: (result) => {
			state.aiSuggestion = result;
			state.isAiLoading = false;
		},
		onError: () => {
			state.isAiLoading = false;
		},
	});

	// 핸들러
	const handlers = useHandlers({
		state,
		router: {
			push: (url: string) => {
				router.push(url as Route);
			},
		},
	});

	/**
	 * 고객 검색 핸들러
	 *
	 * @requires Orval API 훅 생성 후 아래와 같이 변경:
	 * const { data } = await useGetUsers({ search: keyword, take: 10 });
	 * return data?.data?.map(user => ({
	 *   id: user.id,
	 *   name: user.name,
	 *   email: user.email,
	 *   phone: user.phone,
	 * })) ?? [];
	 */
	const onSearchCustomer = async (
		keyword: string,
	): Promise<Array<CustomerInfo & { label: string }>> => {
		if (keyword.length < 2) return [];
		const response = await getUsers({ name: keyword, take: 10 });
		return (response?.data ?? []).map((user) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			label: user.name,
		}));
	};

	/**
	 * 내용 변경 시 AI 분류 트리거
	 */
	const onContentChange = (content: string) => {
		// 내용이 50자 이상일 때만 AI 분류 요청
		if (content.length >= 50) {
			state.isAiLoading = true;
			aiClassification.classify(content);
		}
	};

	/**
	 * AI 제안 적용
	 */
	const onApplyAiSuggestion = () => {
		// AI 제안은 InquiryForm 내부에서 처리됨
		state.aiSuggestion = null;
	};

	/**
	 * AI 제안 무시
	 */
	const onDismissAiSuggestion = () => {
		state.aiSuggestion = null;
	};

	return (
		<PageSurface
			title="문의 접수"
			description="전화, 현장 등 오프라인 문의를 수동으로 접수합니다."
			actions={
				<Button
					variant="flat"
					startContent={<ArrowLeft className="size-4" />}
					onPress={handlers.onClickCancel}
					isDisabled={state.isSubmitting}
				>
					목록으로
				</Button>
			}
		>
			<VStack gap={4}>
				<SectionSurface>
					<InquiryForm
						onSubmit={handlers.onSubmit}
						onContentChange={onContentChange}
						onSearchCustomer={onSearchCustomer}
						isSubmitting={state.isSubmitting}
						aiSuggestion={state.aiSuggestion}
						isAiLoading={state.isAiLoading}
						onApplyAiSuggestion={onApplyAiSuggestion}
						onDismissAiSuggestion={onDismissAiSuggestion}
					/>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(InquiriesNewPageClient);
