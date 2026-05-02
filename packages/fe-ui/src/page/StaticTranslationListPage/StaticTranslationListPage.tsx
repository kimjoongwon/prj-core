"use client";

import type { TranslationResponseDto } from "@cocrepo/api/model/translationResponseDto";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildStaticTranslationTableColumns,
	DataGrid,
	DataGridStateModel,
	getStaticTranslationLanguageLabel,
	HStack,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	type Selection,
	Switch,
	Textarea,
	useDisclosure,
} from "@cocrepo/ui/heroui";
import { Languages, Plus, RefreshCcw } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type FormEvent, useEffect, useState } from "react";
import { useT } from "../../i18n";
import { ConfirmModal } from "../../widget/common/ConfirmModal";

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

export interface StaticTranslationListPageQueryStates
	extends DataGridQueryStates {
	take: number;
	skip: number;
	key: string;
	category: string;
	languageCode: string;
	isTranslated: string;
}

export type StaticTranslationListPageSetQueryStates = DataGridSetQueryStates;

export interface StaticTranslationListPageProps {
	translations?: TranslationResponseDto[];
	totalCount: number;
	isLoading: boolean;
	isMutating: boolean;
	queryStates: StaticTranslationListPageQueryStates;
	setQueryStates: StaticTranslationListPageSetQueryStates;
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
	{ value: "ko_KR", label: "한국어" },
	{ value: "en_US", label: "영어" },
	{ value: "zh_CN", label: "중국어" },
	{ value: "ja_JP", label: "일본어" },
];

const STATIC_TRANSLATION_STATUS_OPTIONS = [
	{ value: "true", label: "완료" },
	{ value: "false", label: "대기" },
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

function getSelectedKey(selection: Selection): string {
	if (selection === "all") {
		return "";
	}

	return Array.from(selection)[0]?.toString() ?? "";
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

export const StaticTranslationListPage = observer(
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
	}: StaticTranslationListPageProps) => {
		const t = useT();
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);
		const formModal = useDisclosure();
		const deleteModal = useDisclosure();
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
			formModal.onOpen();
		}

		function handleOpenEditModal(translation: TranslationResponseDto) {
			setEditingTranslation(translation);
			setForm(createFormFromTranslation(translation));
			formModal.onOpen();
		}

		function handleCloseFormModal() {
			formModal.onClose();
			setEditingTranslation(null);
			setForm(createEmptyForm());
		}

		function handleOpenDeleteModal(translation: TranslationResponseDto) {
			setTranslationToDelete(translation);
			deleteModal.onOpen();
		}

		function handleCloseDeleteModal() {
			deleteModal.onClose();
			setTranslationToDelete(null);
		}

		function handleLanguageSelectionChange(selection: Selection) {
			const selected = toStaticTranslationLanguageCode(
				getSelectedKey(selection),
			);
			if (!selected) {
				return;
			}

			setForm((current) => ({ ...current, languageCode: selected }));
		}

		function handleIsTranslatedChange(isSelected: boolean) {
			setForm((current) => ({ ...current, isTranslated: isSelected }));
		}

		function handleKeyChange(key: string) {
			setForm((current) => ({ ...current, key }));
		}

		function handleCategoryChange(category: string) {
			setForm((current) => ({ ...current, category }));
		}

		function handleTextChange(text: string) {
			setForm((current) => ({ ...current, text }));
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
								isLoading={isMutating}
								onPress={onInvalidateAllTranslationCache}
							>
								{t("전체 캐시 갱신")}
							</Button>
							<Button
								variant="flat"
								startContent={<Languages className="h-4 w-4" />}
								isDisabled={!selectedLanguageCode}
								isLoading={isMutating}
								onPress={handleInvalidateLanguageCache}
							>
								{t("언어 캐시 갱신")}
							</Button>
							<Button
								color="primary"
								startContent={<Plus className="h-4 w-4" />}
								onPress={handleOpenCreateModal}
							>
								{t("번역 등록")}
							</Button>
						</HStack>
					}
				/>
				<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
					<DataGrid
						config={{
							entity: "Translation",
							columns,
							leftInputs,
							emptyMessage: "등록된 정적 번역이 없습니다.",
						}}
						rows={rows}
						totalCount={totalCount}
						isLoading={isLoading}
						state={gridState}
					/>
				</Surface>

				<Modal
					isOpen={formModal.isOpen}
					onClose={handleCloseFormModal}
					size="2xl"
				>
					<ModalContent>
						<form onSubmit={handleSubmitForm}>
							<ModalHeader className="flex flex-col gap-1">
								{isEditMode ? t("번역 수정") : t("번역 등록")}
							</ModalHeader>
							<ModalBody>
								<VStack gap="block">
									<Select
										label={t("언어")}
										selectedKeys={[form.languageCode]}
										isDisabled={isEditMode}
										onSelectionChange={handleLanguageSelectionChange}
									>
										{STATIC_TRANSLATION_LANGUAGE_OPTIONS.map((option) => (
											<SelectItem key={option.value}>
												{t(option.label)}
											</SelectItem>
										))}
									</Select>
									<Input
										label={t("번역 키")}
										value={form.key}
										isDisabled={isEditMode}
										onValueChange={handleKeyChange}
									/>
									<Input
										label={t("카테고리")}
										value={form.category}
										onValueChange={handleCategoryChange}
									/>
									<Textarea
										label={t("번역문")}
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
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={handleCloseFormModal}>
									{t("취소")}
								</Button>
								<Button
									color="primary"
									type="submit"
									isDisabled={isFormInvalid}
									isLoading={isMutating}
								>
									{isEditMode ? t("수정") : t("등록")}
								</Button>
							</ModalFooter>
						</form>
					</ModalContent>
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
							<p className="mt-2 text-sm text-default-400">
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
