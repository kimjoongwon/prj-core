"use client";

import type { ServiceDocumentDto } from "@cocrepo/api/core/service-documents";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import { ListBox, Spinner, Table } from "@heroui/react";
import {
	Archive,
	FileText,
	Pencil,
	Plus,
	Rocket,
	Save,
	Trash2,
	X,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Button } from "../../input/Button/Button";
import { Checkbox } from "../../input/Checkbox/Checkbox";
import { Select } from "../../input/Select/Select";
import { TextArea } from "../../input/TextArea/TextArea";
import { TextField } from "../../input/TextField/TextField";
import { Screen, Section } from "../../layout";
import { HStack, VStack } from "../../rhythm";
import { ScreenSurface, SectionSurface } from "../../surface";
import { HtmlEditor } from "../../widget/HtmlEditor";
import { PageTitleBar } from "../../widget/PageTitleBar/PageTitleBar";

type ServiceDocumentKindValue = ServiceDocumentDto["kind"];
type ServiceDocumentPlatformValue = ServiceDocumentDto["platform"];
type ServiceDocumentStatusValue = ServiceDocumentDto["status"];
type ServiceDocumentFormatValue = ServiceDocumentDto["format"];
export interface ServiceDocumentListScreenQueryStates
	extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	kind: string;
	platform: string;
	status: string;
	locale: string;
}
export type ServiceDocumentListScreenSetQueryStates = DataGridSetQueryStates;
export interface ServiceDocumentFormDraft {
	kind: ServiceDocumentKindValue;
	platform: ServiceDocumentPlatformValue;
	locale: string;
	title: string;
	summary: string;
	content: string;
	format: ServiceDocumentFormatValue;
	version: string;
	isRequired: boolean;
	displayOrder: number;
	effectiveAt: string;
}
export type ServiceDocumentFormMode = "create" | "edit" | "idle";
export interface ServiceDocumentListScreenProps {
	documents?: ServiceDocumentDto[];
	totalCount: number;
	isLoading: boolean;
	isSubmitting: boolean;
	queryStates: ServiceDocumentListScreenQueryStates;
	setQueryStates: ServiceDocumentListScreenSetQueryStates;
	formMode: ServiceDocumentFormMode;
	draft: ServiceDocumentFormDraft;
	editingDocumentId?: string | null;
	onChangeSearchInput: (value: string) => void;
	onChangeKindFilter: (value: string) => void;
	onChangePlatformFilter: (value: string) => void;
	onChangeStatusFilter: (value: string) => void;
	onChangeLocaleFilter: (value: string) => void;
	onChangeDraftField: <TField extends keyof ServiceDocumentFormDraft>(
		field: TField,
		value: ServiceDocumentFormDraft[TField],
	) => void;
	onClickNewButton: () => void;
	onClickCancelFormButton: () => void;
	onClickSubmitButton: () => Promise<void>;
	onClickEditButton: (serviceDocumentId: string) => void;
	onClickPublishButton: (serviceDocumentId: string) => Promise<void>;
	onClickArchiveButton: (serviceDocumentId: string) => Promise<void>;
	onClickDeleteButton: (serviceDocumentId: string) => Promise<void>;
}
const KIND_OPTIONS: Array<{
	value: ServiceDocumentKindValue;
	label: string;
}> = [
	{
		value: "TERMS_OF_SERVICE",
		label: "서비스 이용약관",
	},
	{
		value: "PRIVACY_POLICY",
		label: "개인정보처리방침",
	},
	{
		value: "MARKETING_CONSENT",
		label: "마케팅 정보 수신 동의",
	},
	{
		value: "LOCATION_CONSENT",
		label: "위치정보 이용 동의",
	},
	{
		value: "THIRD_PARTY_SHARING",
		label: "제3자 제공 동의",
	},
];
const PLATFORM_OPTIONS: Array<{
	value: ServiceDocumentPlatformValue;
	label: string;
}> = [
	{
		value: "ALL",
		label: "공통",
	},
	{
		value: "WEB",
		label: "Web",
	},
	{
		value: "MOBILE",
		label: "Mobile",
	},
];
const STATUS_OPTIONS: Array<{
	value: ServiceDocumentStatusValue;
	label: string;
	color: "default" | "primary" | "warning";
}> = [
	{
		value: "DRAFT",
		label: "초안",
		color: "warning",
	},
	{
		value: "PUBLISHED",
		label: "게시",
		color: "primary",
	},
	{
		value: "ARCHIVED",
		label: "보관",
		color: "default",
	},
];
const FORMAT_OPTIONS: Array<{
	value: ServiceDocumentFormatValue;
	label: string;
}> = [
	{
		value: "MARKDOWN",
		label: "Markdown",
	},
	{
		value: "HTML",
		label: "HTML",
	},
	{
		value: "PLAIN_TEXT",
		label: "Plain text",
	},
];
const ALL_FILTER_OPTION = "ALL_FILTER_OPTION";
const KIND_FILTER_OPTIONS = [
	{
		value: ALL_FILTER_OPTION,
		label: "전체",
	},
	...KIND_OPTIONS.map(({ value, label }) => ({
		value,
		label,
	})),
];
const PLATFORM_FILTER_OPTIONS = [
	{
		value: ALL_FILTER_OPTION,
		label: "전체",
	},
	...PLATFORM_OPTIONS.map(({ value, label }) => ({
		value,
		label,
	})),
];
const STATUS_FILTER_OPTIONS = [
	{
		value: ALL_FILTER_OPTION,
		label: "전체",
	},
	...STATUS_OPTIONS.map(({ value, label }) => ({
		value,
		label,
	})),
];
function getKindLabel(kind: ServiceDocumentKindValue): string {
	return KIND_OPTIONS.find((option) => option.value === kind)?.label ?? kind;
}
function getPlatformLabel(platform: ServiceDocumentPlatformValue): string {
	return (
		PLATFORM_OPTIONS.find((option) => option.value === platform)?.label ??
		platform
	);
}
function getStatusOption(status: ServiceDocumentStatusValue) {
	return (
		STATUS_OPTIONS.find((option) => option.value === status) ??
		STATUS_OPTIONS[0]
	);
}
function formatDate(value?: string | null): string {
	if (!value) return "-";
	return new Date(value).toLocaleDateString("ko-KR");
}
function getFilterSelectedKey(value: string): string {
	return value || ALL_FILTER_OPTION;
}
function normalizeFilterValue(value: string): string {
	return value === ALL_FILTER_OPTION ? "" : value;
}
export const ServiceDocumentListScreen = observer(
	({
		documents,
		totalCount,
		isLoading,
		isSubmitting,
		queryStates,
		formMode,
		draft,
		editingDocumentId,
		onChangeSearchInput,
		onChangeKindFilter,
		onChangePlatformFilter,
		onChangeStatusFilter,
		onChangeLocaleFilter,
		onChangeDraftField,
		onClickNewButton,
		onClickCancelFormButton,
		onClickSubmitButton,
		onClickEditButton,
		onClickPublishButton,
		onClickArchiveButton,
		onClickDeleteButton,
	}: ServiceDocumentListScreenProps) => {
		const rows = documents ?? [];
		const isEditing = formMode === "edit";
		const isHtmlFormat = draft.format === "HTML";
		const onChangeContentEditor = (value: string) => {
			onChangeDraftField("content", value);
		};
		return (
			<Screen>
				<ScreenSurface>
					<VStack fullWidth>
						<PageTitleBar
							title="약관 관리"
							description="모바일과 web 서비스에 노출되는 약관, 개인정보, 동의 문서를 버전별로 관리합니다."
							actions={
								<Button
									color="primary"
									startContent={<Plus className="h-4 w-4" />}
									onPress={onClickNewButton}
								>
									문서 등록
								</Button>
							}
						/>

						<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
							<VStack key="document-list-column" fullWidth>
								<SectionSurface key="filters">
									<Section>
										<Section.Body>
											<VStack fullWidth>
												<div
													key="filter-controls"
													className="grid grid-cols-1 gap-3 md:grid-cols-5"
												>
													<TextField
														key="search-filter"
														className="md:col-span-2"
														label="검색"
														placeholder="제목, 요약, 버전"
														value={queryStates.search}
														onValueChange={onChangeSearchInput}
													/>
													<Select
														key="kind-filter"
														label="문서 종류"
														value={getFilterSelectedKey(queryStates.kind)}
														onChange={(value) =>
															onChangeKindFilter(
																normalizeFilterValue(String(value ?? "")),
															)
														}
														items={KIND_FILTER_OPTIONS}
													>
														{(option) => (
															<ListBox.Item
																key={option.value}
																id={option.value}
																textValue={option.label}
															>
																{option.label}
															</ListBox.Item>
														)}
													</Select>
													<Select
														key="platform-filter"
														label="플랫폼"
														value={getFilterSelectedKey(queryStates.platform)}
														onChange={(value) =>
															onChangePlatformFilter(
																normalizeFilterValue(String(value ?? "")),
															)
														}
														items={PLATFORM_FILTER_OPTIONS}
													>
														{(option) => (
															<ListBox.Item
																key={option.value}
																id={option.value}
																textValue={option.label}
															>
																{option.label}
															</ListBox.Item>
														)}
													</Select>
													<Select
														key="status-filter"
														label="상태"
														value={getFilterSelectedKey(queryStates.status)}
														onChange={(value) =>
															onChangeStatusFilter(
																normalizeFilterValue(String(value ?? "")),
															)
														}
														items={STATUS_FILTER_OPTIONS}
													>
														{(option) => (
															<ListBox.Item
																key={option.value}
																id={option.value}
																textValue={option.label}
															>
																{option.label}
															</ListBox.Item>
														)}
													</Select>
												</div>
												<TextField
													key="locale-filter"
													label="로케일"
													placeholder="ko-KR"
													value={queryStates.locale}
													onValueChange={onChangeLocaleFilter}
												/>
											</VStack>
										</Section.Body>
									</Section>
								</SectionSurface>

								<SectionSurface key="documents">
									<Section overflow="hidden">
										<Section.Body>
											<VStack fullWidth>
												<HStack
													key="documents-header"
													justifyContent="between"
													alignItems="center"
													fullWidth
												>
													<div key="documents-summary">
														<p
															key="documents-summary-title"
															className="text-sm font-semibold text-foreground"
														>
															문서 목록
														</p>
														<p
															key="documents-summary-count"
															className="text-xs text-muted"
														>
															총 {totalCount.toLocaleString("ko-KR")}개
														</p>
													</div>
													{isLoading ? (
														<Spinner key="documents-loading" size="sm" />
													) : null}
												</HStack>
												<Table
													key="documents-table"
													aria-label="서비스 문서 목록"
												>
													<Table.Content>
														<Table.Header>
															<Table.Column key="document">문서</Table.Column>
															<Table.Column key="platform">플랫폼</Table.Column>
															<Table.Column key="status">상태</Table.Column>
															<Table.Column key="version">버전</Table.Column>
															<Table.Column key="publishedAt">
																게시일
															</Table.Column>
															<Table.Column
																key="actions"
																className="text-right"
															>
																액션
															</Table.Column>
														</Table.Header>
														<Table.Body items={rows}>
															{(document) => {
																const status = getStatusOption(document.status);
																const canEdit = document.status === "DRAFT";
																const canPublish =
																	document.status !== "PUBLISHED";
																return (
																	<Table.Row key={document.id}>
																		<Table.Cell>
																			<VStack>
																				<HStack alignItems="center">
																					<FileText
																						key="document-icon"
																						className="h-4 w-4 text-accent"
																					/>
																					<span
																						key="document-title"
																						className="font-medium"
																					>
																						{document.title}
																					</span>
																				</HStack>
																				<span className="text-xs text-muted">
																					{getKindLabel(document.kind)} ·{" "}
																					{document.locale}
																				</span>
																			</VStack>
																		</Table.Cell>
																		<Table.Cell>
																			{getPlatformLabel(document.platform)}
																		</Table.Cell>
																		<Table.Cell>
																			<Chip
																				color={status.color}
																				size="sm"
																				variant="flat"
																			>
																				{status.label}
																			</Chip>
																		</Table.Cell>
																		<Table.Cell>{document.version}</Table.Cell>
																		<Table.Cell>
																			{formatDate(document.publishedAt)}
																		</Table.Cell>
																		<Table.Cell>
																			<HStack justifyContent="end">
																				<Button
																					key="edit"
																					isIconOnly
																					size="sm"
																					variant="light"
																					aria-label="문서 수정"
																					isDisabled={!canEdit}
																					onPress={() =>
																						onClickEditButton(document.id)
																					}
																				>
																					<Pencil className="h-4 w-4" />
																				</Button>
																				<Button
																					key="publish"
																					isIconOnly
																					size="sm"
																					variant="light"
																					color="primary"
																					aria-label="문서 게시"
																					isDisabled={!canPublish}
																					onPress={() =>
																						onClickPublishButton(document.id)
																					}
																				>
																					<Rocket className="h-4 w-4" />
																				</Button>
																				<Button
																					key="archive"
																					isIconOnly
																					size="sm"
																					variant="light"
																					aria-label="문서 보관"
																					onPress={() =>
																						onClickArchiveButton(document.id)
																					}
																				>
																					<Archive className="h-4 w-4" />
																				</Button>
																				<Button
																					key="delete"
																					isIconOnly
																					size="sm"
																					variant="light"
																					color="danger"
																					aria-label="문서 삭제"
																					onPress={() =>
																						onClickDeleteButton(document.id)
																					}
																				>
																					<Trash2 className="h-4 w-4" />
																				</Button>
																			</HStack>
																		</Table.Cell>
																	</Table.Row>
																);
															}}
														</Table.Body>
													</Table.Content>
												</Table>
											</VStack>
										</Section.Body>
									</Section>
								</SectionSurface>
							</VStack>

							<SectionSurface key="document-form-column">
								<Section>
									<Section.Body>
										<VStack fullWidth>
											<HStack
												key="form-header"
												justifyContent="between"
												alignItems="center"
												fullWidth
											>
												<div key="form-title">
													<p
														key="form-title-heading"
														className="text-sm font-semibold text-foreground"
													>
														{isEditing ? "문서 수정" : "새 문서"}
													</p>
													<p
														key="form-title-description"
														className="text-xs text-muted"
													>
														{editingDocumentId
															? "초안 문서만 수정할 수 있습니다."
															: "게시 전 초안으로 저장됩니다."}
													</p>
												</div>
												<Button
													key="close-form"
													isIconOnly
													size="sm"
													variant="light"
													aria-label="작성 취소"
													isDisabled={isSubmitting}
													onPress={onClickCancelFormButton}
												>
													<X className="h-4 w-4" />
												</Button>
											</HStack>

											<div
												key="form-fields"
												className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1"
											>
												<Select
													key="draft-kind"
													label="문서 종류"
													isDisabled={isEditing}
													value={draft.kind}
													onChange={(value) => {
														if (value != null) {
															onChangeDraftField(
																"kind",
																String(value) as ServiceDocumentKindValue,
															);
														}
													}}
												>
													{KIND_OPTIONS.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
													))}
												</Select>
												<Select
													key="draft-platform"
													label="플랫폼"
													isDisabled={isEditing}
													value={draft.platform}
													onChange={(value) => {
														if (value != null) {
															onChangeDraftField(
																"platform",
																String(value) as ServiceDocumentPlatformValue,
															);
														}
													}}
												>
													{PLATFORM_OPTIONS.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
													))}
												</Select>
												<TextField
													key="draft-locale"
													label="로케일"
													isDisabled={isEditing}
													value={draft.locale}
													onValueChange={(value) =>
														onChangeDraftField("locale", value)
													}
												/>
												<TextField
													key="draft-version"
													label="버전"
													isDisabled={isEditing}
													placeholder="2026.05.02"
													value={draft.version}
													onValueChange={(value) =>
														onChangeDraftField("version", value)
													}
												/>
												<TextField
													key="draft-title"
													className="md:col-span-2 xl:col-span-1"
													label="제목"
													value={draft.title}
													onValueChange={(value) =>
														onChangeDraftField("title", value)
													}
												/>
												<TextField
													key="draft-summary"
													className="md:col-span-2 xl:col-span-1"
													label="요약"
													value={draft.summary}
													onValueChange={(value) =>
														onChangeDraftField("summary", value)
													}
												/>
												<Select
													key="draft-format"
													label="본문 형식"
													value={draft.format}
													onChange={(value) => {
														if (value != null) {
															onChangeDraftField(
																"format",
																String(value) as ServiceDocumentFormatValue,
															);
														}
													}}
												>
													{FORMAT_OPTIONS.map((option) => (
														<ListBox.Item
															key={option.value}
															id={option.value}
															textValue={option.label}
														>
															{option.label}
														</ListBox.Item>
													))}
												</Select>
												<TextField
													key="draft-display-order"
													label="정렬 순서"
													type="number"
													value={String(draft.displayOrder)}
													onValueChange={(value) =>
														onChangeDraftField(
															"displayOrder",
															Number(value || 0),
														)
													}
												/>
											</div>
											<Checkbox
												key="required-checkbox"
												isSelected={draft.isRequired}
												onValueChange={(value) =>
													onChangeDraftField("isRequired", value)
												}
											>
												필수 동의 문서
											</Checkbox>
											<TextField
												key="effective-at-input"
												label="효력 시작 시각"
												type="datetime-local"
												value={draft.effectiveAt}
												onValueChange={(value) =>
													onChangeDraftField("effectiveAt", value)
												}
											/>
											{isHtmlFormat ? (
												<HtmlEditor
													key="html-content-editor"
													label="본문"
													value={draft.content}
													minHeight={360}
													onChange={onChangeContentEditor}
												/>
											) : (
												<TextArea
													key="plain-content-editor"
													label="본문"
													minRows={12}
													value={draft.content}
													onValueChange={onChangeContentEditor}
												/>
											)}
											<HStack key="form-actions" justifyContent="end">
												<Button
													key="cancel"
													variant="flat"
													isDisabled={isSubmitting}
													onPress={onClickCancelFormButton}
												>
													취소
												</Button>
												<Button
													key="submit"
													color="primary"
													startContent={<Save className="h-4 w-4" />}
													isDisabled={isSubmitting}
													onPress={onClickSubmitButton}
												>
													{isEditing ? "수정 저장" : "초안 저장"}
												</Button>
											</HStack>
										</VStack>
									</Section.Body>
								</Section>
							</SectionSurface>
						</div>
					</VStack>
				</ScreenSurface>
			</Screen>
		);
	},
);
