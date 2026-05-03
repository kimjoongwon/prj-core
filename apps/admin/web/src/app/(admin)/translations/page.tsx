"use client";

import {
	getGetTranslationsQueryKey,
	useCreateTranslation,
	useDeleteTranslation,
	useGetTranslations,
	useInvalidateAllTranslationCache,
	useInvalidateTranslationCache,
	useUpdateTranslation,
} from "@cocrepo/api/core/translations";
import type { GetTranslationsParams } from "@cocrepo/api/core/model";
import {
	type StaticTranslationForm,
	type StaticTranslationLanguageCode,
	StaticTranslationListPage,
	type StaticTranslationListPageQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function TranslationsPageRoute() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		key: parseAsString.withDefault(""),
		category: parseAsString.withDefault(""),
		languageCode: parseAsString.withDefault(""),
		isTranslated: parseAsString.withDefault(""),
	});
	const queryParams = getTranslationsParams(queryStates);
	const {
		data: response,
		isLoading,
		isFetching,
	} = useGetTranslations(queryParams);
	const createMutation = useCreateTranslation();
	const updateMutation = useUpdateTranslation();
	const deleteMutation = useDeleteTranslation();
	const invalidateAllMutation = useInvalidateAllTranslationCache();
	const invalidateLanguageMutation = useInvalidateTranslationCache();
	const isMutating =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending ||
		invalidateAllMutation.isPending ||
		invalidateLanguageMutation.isPending;

	async function invalidateTranslationsQuery() {
		await queryClient.invalidateQueries({
			queryKey: getGetTranslationsQueryKey(),
		});
	}

	async function onCreateTranslation(form: StaticTranslationForm) {
		try {
			await createMutation.mutateAsync({ data: form });
			await invalidateTranslationsQuery();
			addToast({
				title: "번역 등록 완료",
				description: "정적 번역 key-value가 등록되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "번역 등록 실패",
				description: "정적 번역 등록 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	}

	async function onUpdateTranslation(
		translationId: string,
		form: Pick<StaticTranslationForm, "text" | "category" | "isTranslated">,
	) {
		try {
			await updateMutation.mutateAsync({
				translationId,
				data: form,
			});
			await invalidateTranslationsQuery();
			addToast({
				title: "번역 수정 완료",
				description: "정적 번역 key-value가 수정되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "번역 수정 실패",
				description: "정적 번역 수정 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	}

	async function onDeleteTranslation(translationId: string) {
		try {
			await deleteMutation.mutateAsync({ translationId });
			await invalidateTranslationsQuery();
			addToast({
				title: "번역 삭제 완료",
				description: "정적 번역 key-value가 삭제되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "번역 삭제 실패",
				description: "정적 번역 삭제 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	}

	async function onInvalidateAllTranslationCache() {
		try {
			await invalidateAllMutation.mutateAsync();
			await invalidateTranslationsQuery();
			addToast({
				title: "전체 캐시 갱신 완료",
				description: "전체 번역 캐시가 갱신되었습니다.",
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "전체 캐시 갱신 실패",
				description: "전체 번역 캐시 갱신 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	}

	async function onInvalidateTranslationCache(
		languageCode: StaticTranslationLanguageCode,
	) {
		try {
			await invalidateLanguageMutation.mutateAsync({ languageCode });
			await invalidateTranslationsQuery();
			addToast({
				title: "언어 캐시 갱신 완료",
				description: `${languageCode} 번역 캐시가 갱신되었습니다.`,
				color: "success",
			});
		} catch (error) {
			addToast({
				title: "언어 캐시 갱신 실패",
				description: "언어별 번역 캐시 갱신 중 오류가 발생했습니다.",
				color: "danger",
			});
			throw error;
		}
	}

	return (
		<StaticTranslationListPage
			translations={response?.data}
			totalCount={response?.meta?.total ?? 0}
			isLoading={isLoading || isFetching}
			isMutating={isMutating}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onCreateTranslation={onCreateTranslation}
			onUpdateTranslation={onUpdateTranslation}
			onDeleteTranslation={onDeleteTranslation}
			onInvalidateAllTranslationCache={onInvalidateAllTranslationCache}
			onInvalidateTranslationCache={onInvalidateTranslationCache}
		/>
	);
});

function getTranslationsParams(
	queryStates: StaticTranslationListPageQueryStates,
): GetTranslationsParams {
	const take = queryStates.take > 0 ? queryStates.take : 20;

	return {
		page: Math.floor(queryStates.skip / take) + 1,
		limit: take,
		key: queryStates.key || undefined,
		category: queryStates.category || undefined,
		languageCode: queryStates.languageCode
			? (queryStates.languageCode as GetTranslationsParams["languageCode"])
			: undefined,
		isTranslated:
			queryStates.isTranslated === "true"
				? true
				: queryStates.isTranslated === "false"
					? false
					: undefined,
	};
}
