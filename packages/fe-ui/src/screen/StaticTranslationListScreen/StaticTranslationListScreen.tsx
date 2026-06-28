"use client";

import type { TranslationResponseDto } from "@cocrepo/api/model/translationResponseDto";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	Button,
	buildStaticTranslationTableColumns,
	DataGrid,
	DataGridStateModel,
	getStaticTranslationLanguageLabel,
	HStack,
	Input,
	PageTitleBar,
	Section,
	SectionSurface,
	TextArea,
	useT,
	VStack,
} from "@cocrepo/ui";
import { Modal, useOverlayState } from "@heroui/react";
import { Languages, Plus, RefreshCcw } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type FormEvent, useEffect, useState } from "react";
import { Select } from "../../selection/Select/Select";
import { Switch } from "../../selection/Switch/Switch";
import { ConfirmModal } from "../../widget/ConfirmModal";
export type StaticTranslationLanguageCode =
	| "ko_KR"
	| "en_US"
	| "zh_CN"
	| "ja_JP";
export interface StaticTranslationForm {
	languageCode: StaticTranslationLanguageCode;
	key: string;
	text: string;
	category: string;
	isTranslated: boolean;
}
export interface StaticTranslationListScreenQueryStates
	extends DataGridQueryStates {
	take: number;
	skip: number;
	key: string;
	category: string;
	languageCode: string;
	isTranslated: string;
}
export type StaticTranslationListScreenSetQueryStates = DataGridSetQueryStates;
export interface StaticTranslationListScreenProps {
	translations?: TranslationResponseDto[];
	totalCount: number;
	isLoading: boolean;
	isMutating: boolean;
	queryStates: StaticTranslationListScreenQueryStates;
	setQueryStates: StaticTranslationListScreenSetQueryStates;
	onCreateTranslation: (form: StaticTranslationForm) => Promise<void>;
	onUpdateTranslation: (
		translationId: string,
		form: Pick<StaticTranslationForm, "text" | "category" | "isTranslated">,
	) => Promise<void>;
	onDeleteTranslation: (translationId: string) => Promise<void>;
	onInvalidateAllTranslationCache: () => Promise<void>;
	onInvalidateTranslationCache: (
		languageCode: StaticTranslationLanguageCode,
	) => Promise<void>;
}
const STATIC_TRANSLATION_LANGUAGE_OPTIONS: Array<{
	value: StaticTranslationLanguageCode;
	label: string;
}> = [
	{
		value: "ko_KR",
		label: "한국어",
	},
	{
		value: "en_US",
		label: "English",
	},
	{
		value: "zh_CN",
		label: "中文",
	},
	{
		value: "ja_JP",
		label: "日本語",
	},
];
const STATIC_TRANSLATION_STATUS_OPTIONS = [
	{
		value: "true",
		label: "완료",
	},
	{
		value: "false",
		label: "대기",
	},
];
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "key",
		placeholder: "번역 키 검색...",
	},
	{
		type: "search",
		id: "category",
		placeholder: "카테고리 검색...",
	},
	{
		type: "select",
		id: "languageCode",
		placeholder: "언어",
		props: {
			options: STATIC_TRANSLATION_LANGUAGE_OPTIONS,
			isClearable: true,
		},
	},
	{
		type: "select",
		id: "isTranslated",
		placeholder: "번역 상태",
		props: {
			options: STATIC_TRANSLATION_STATUS_OPTIONS,
			isClearable: true,
		},
	},
];
export const adminStaticTranslationsPageQueryInputs = [...leftInputs];
function createEmptyForm(): StaticTranslationForm {
	return {
		languageCode: "ko_KR",
		key: "",
		text: "",
		category: "공통",
		isTranslated: false,
	};
}
function createFormFromTranslation(
	translation: TranslationResponseDto,
): StaticTranslationForm {
	return {
		languageCode: translation.languageCode as StaticTranslationLanguageCode,
		key: translation.key,
		text: translation.text,
		category: translation.category,
		isTranslated: translation.isTranslated,
	};
}
function toStaticTranslationLanguageCode(
	value: string,
): StaticTranslationLanguageCode | null {
	if (
		value === "ko_KR" ||
		value === "en_US" ||
		value === "zh_CN" ||
		value === "ja_JP"
	) {
		return value;
	}
	return null;
}
export const StaticTranslationListScreen = observer(
	({
		translations,
		totalCount,
		isLoading,
		isMutating,
		queryStates,
		setQueryStates,
		onCreateTranslation,
		onUpdateTranslation,
		onDeleteTranslation,
		onInvalidateAllTranslationCache,
		onInvalidateTranslationCache,
	}: StaticTranslationListScreenProps) => {
		const t = useT();
		const gridState = useLocalObservable(
			() =>
				new DataGridStateModel({
					queryStates,
					setQueryStates,
				}),
		);
		const formModal = useOverlayState();
		const deleteModal = useOverlayState();
		const [editingTranslation, setEditingTranslation] =
			useState<TranslationResponseDto | null>(null);
		const [translationToDelete, setTranslationToDelete] =
			useState<TranslationResponseDto | null>(null);
		const [form, setForm] = useState<StaticTranslationForm>(createEmptyForm);
		const rows = translations ?? [];
		const selectedLanguageCode = toStaticTranslationLanguageCode(
			queryStates.languageCode,
		);
		const isEditMode = editingTranslation !== null;
		const isFormInvalid =
			!form.languageCode ||
			!form.key.trim() ||
			!form.text.trim() ||
			!form.category.trim();
		const columns = buildStaticTranslationTableColumns<TranslationResponseDto>({
			onClickEditButton: handleOpenEditModal,
			onClickDeleteButton: handleOpenDeleteModal,
		});
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		function handleOpenCreateModal() {
			setEditingTranslation(null);
			setForm(createEmptyForm());
			formModal.open();
		}
		function handleOpenEditModal(translation: TranslationResponseDto) {
			setEditingTranslation(translation);
			setForm(createFormFromTranslation(translation));
			formModal.open();
		}
		function handleCloseFormModal() {
			formModal.close();
			setEditingTranslation(null);
			setForm(createEmptyForm());
		}
		function handleOpenDeleteModal(translation: TranslationResponseDto) {
			setTranslationToDelete(translation);
			deleteModal.open();
		}
		function handleCloseDeleteModal() {
			deleteModal.close();
			setTranslationToDelete(null);
		}
		function handleLanguageChange(value: string) {
			const selected = toStaticTranslationLanguageCode(value);
			if (!selected) {
				return;
			}
			setForm((current) => ({
				...current,
				languageCode: selected,
			}));
		}
		function handleIsTranslatedChange(isSelected: boolean) {
			setForm((current) => ({
				...current,
				isTranslated: isSelected,
			}));
		}
		function handleKeyChange(key: string) {
			setForm((current) => ({
				...current,
				key,
			}));
		}
		function handleCategoryChange(category: string) {
			setForm((current) => ({
				...current,
				category,
			}));
		}
		function handleTextChange(text: string) {
			setForm((current) => ({
				...current,
				text,
			}));
		}
		async function handleSubmitForm(event: FormEvent<HTMLFormElement>) {
			event.preventDefault();
			if (isFormInvalid) {
				return;
			}
			if (editingTranslation) {
				await onUpdateTranslation(editingTranslation.id, {
					text: form.text,
					category: form.category,
					isTranslated: form.isTranslated,
				});
			} else {
				await onCreateTranslation({
					...form,
					key: form.key.trim(),
					text: form.text.trim(),
					category: form.category.trim(),
				});
			}
			handleCloseFormModal();
		}
		async function handleConfirmDelete() {
			if (!translationToDelete) {
				return;
			}
			await onDeleteTranslation(translationToDelete.id);
			handleCloseDeleteModal();
		}
		async function handleInvalidateLanguageCache() {
			if (!selectedLanguageCode) {
				return;
			}
			await onInvalidateTranslationCache(selectedLanguageCode);
		}
		return (
			<VStack gap={5}>
				<PageTitleBar
					title="정적 번역"
					description="admin과 idp에서 사용하는 정적 다국어 key-value를 관리합니다."
					actions={
						<HStack gap="inline" className="flex-wrap justify-end">
							<Button
								variant="flat"
								startContent={<RefreshCcw className="h-4 w-4" />}
								onPress={onInvalidateAllTranslationCache}
							>
								전체 캐시 갱신
							</Button>
							<Button
								variant="flat"
								startContent={<Languages className="h-4 w-4" />}
								isDisabled={!selectedLanguageCode}
								onPress={handleInvalidateLanguageCache}
							>
								언어 캐시 갱신
							</Button>
							<Button
								color="primary"
								startContent={<Plus className="h-4 w-4" />}
								onPress={handleOpenCreateModal}
							>
								번역 등록
							</Button>
						</HStack>
					}
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden" inset="none">
						<Section.Body>
							<DataGrid
								config={{
									entity: "Translation",
									columns,
									leftInputs,
									emptyMessage: "등록된 정적 번역이 없습니다.",
								}}
								rows={rows}
								totalCount={totalCount}
								state={gridState}
								isLoading={isLoading}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
				<Modal state={formModal}>
					<Modal.Backdrop>
						<Modal.Container size="lg">
							<Modal.Dialog>
								<form onSubmit={handleSubmitForm}>
									<Modal.Header className="flex flex-col gap-1">
										{t(isEditMode ? "번역 수정" : "번역 등록")}
									</Modal.Header>
									<Modal.Body>
										<VStack gap="block">
											<Select
												label="언어"
												value={form.languageCode}
												isDisabled={isEditMode}
												onChange={(value) =>
													handleLanguageChange(String(value ?? ""))
												}
												options={STATIC_TRANSLATION_LANGUAGE_OPTIONS}
											/>
											<Input
												label="번역 키"
												value={form.key}
												isDisabled={isEditMode}
												onValueChange={handleKeyChange}
											/>
											<Input
												label="카테고리"
												value={form.category}
												onValueChange={handleCategoryChange}
											/>
											<TextArea
												label="번역문"
												value={form.text}
												minRows={4}
												onValueChange={handleTextChange}
											/>
											<Switch
												isSelected={form.isTranslated}
												onValueChange={handleIsTranslatedChange}
											>
												{t("번역 완료")}
											</Switch>
										</VStack>
									</Modal.Body>
									<Modal.Footer>
										<Button variant="light" onPress={handleCloseFormModal}>
											취소
										</Button>
										<Button
											color="primary"
											type="submit"
											isDisabled={isFormInvalid}
										>
											{isEditMode ? "수정" : "등록"}
										</Button>
									</Modal.Footer>
								</form>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
				<ConfirmModal
					isOpen={deleteModal.isOpen}
					onClose={handleCloseDeleteModal}
					onConfirm={handleConfirmDelete}
					title="번역 삭제"
					message={
						<>
							<p>
								<strong>{translationToDelete?.key}</strong>{" "}
								{t("번역을 삭제하시겠습니까?")}
							</p>
							<p className="mt-2 text-sm text-muted">
								{translationToDelete
									? getStaticTranslationLanguageLabel(
											translationToDelete.languageCode,
										)
									: ""}{" "}
								{t("항목이 즉시 삭제됩니다.")}
							</p>
						</>
					}
					confirmText="삭제"
					confirmColor="danger"
					iconType="delete"
					loading={isMutating}
				/>
			</VStack>
		);
	},
);
