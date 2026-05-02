"use client";

import {
	Button,
	Card,
	CardBody,
	Chip,
	Input,
	Select,
	SelectItem,
	type SharedSelection,
} from "@cocrepo/ui/heroui";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import type {
	AiFormFieldMeta,
	AiFormPatch,
	AiFormSchema,
	AiFormUiPaths,
} from "./type";
import type { AiFormProps } from "./type";

interface FieldRuntimeMeta {
	path: string;
	label: string;
	reason?: string;
	optionCount: number;
	fillable: boolean;
	isHidden: boolean;
	isReadOnly: boolean;
	isDisabled: boolean;
	selectable: boolean;
}

function normalizePath(path: string): string {
	return path.replace(/\[(\d+)\]/g, ".$1");
}

function toNormalizedSet(paths: string[]): Set<string> {
	return new Set(paths.map((path) => normalizePath(path)));
}

function findFieldMeta(
	path: string,
	fieldMeta: Record<string, AiFormFieldMeta>,
): AiFormFieldMeta | undefined {
	return fieldMeta[path] ?? fieldMeta[normalizePath(path)];
}

function isBlockedPath(path: string, ui: AiFormUiPaths): boolean {
	const normalized = normalizePath(path);
	const hidden = toNormalizedSet(ui.hiddenPaths);
	const readOnly = toNormalizedSet(ui.readOnlyPaths);
	const disabled = toNormalizedSet(ui.disabledPaths);
	return (
		hidden.has(normalized) ||
		readOnly.has(normalized) ||
		disabled.has(normalized)
	);
}

function buildDefaultSelectedPaths(
	schema: AiFormSchema,
	fieldMeta: Record<string, AiFormFieldMeta>,
	ui: AiFormUiPaths,
): string[] {
	const selectedPaths: string[] = [];
	for (const path of schema.paths) {
		const meta = findFieldMeta(path, fieldMeta);
		const fillable = meta?.ai?.fillable ?? false;
		if (!fillable || isBlockedPath(path, ui)) {
			continue;
		}

		if (meta?.ai?.defaultChecked !== false) {
			selectedPaths.push(path);
		}
	}
	return selectedPaths;
}

function sanitizePatches(
	patches: AiFormPatch[],
	selectedPaths: string[],
	fieldMeta: Record<string, AiFormFieldMeta>,
	ui: AiFormUiPaths,
): AiFormPatch[] {
	const selectedPathSet = new Set(
		selectedPaths.map((path) => normalizePath(path)),
	);
	return patches.filter((patch) => {
		const normalizedPath = normalizePath(patch.path);
		if (!selectedPathSet.has(normalizedPath)) {
			return false;
		}

		const meta = findFieldMeta(patch.path, fieldMeta);
		const fillable = meta?.ai?.fillable ?? false;
		if (!fillable) {
			return false;
		}

		if (isBlockedPath(patch.path, ui)) {
			return false;
		}

		return true;
	});
}

function buildFieldStatus(item: FieldRuntimeMeta): string {
	if (item.isHidden) {
		return "숨김";
	}
	if (item.isReadOnly) {
		return "읽기 전용";
	}
	if (item.isDisabled) {
		return "비활성";
	}
	if (!item.fillable) {
		return "AI 제외";
	}
	return "";
}

const AiFormComponent = <TForm extends Record<string, unknown>>({
	formState,
	fieldMeta,
	aiSchemas,
	ui,
	options,
	onFill,
	applyPatch,
	onRevalidate,
	disabled = false,
}: AiFormProps<TForm>) => {
	const [selectedSchemaKey, setSelectedSchemaKey] = useState<string>("");
	const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
	const [userPrompt, setUserPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [lastAppliedCount, setLastAppliedCount] = useState(0);
	const [isFieldPanelOpen, setIsFieldPanelOpen] = useState(false);

	useEffect(() => {
		if (aiSchemas.length === 0) {
			setSelectedSchemaKey("");
			setSelectedPaths([]);
			return;
		}

		const hasCurrent = aiSchemas.some(
			(schema) => schema.key === selectedSchemaKey,
		);
		if (hasCurrent) {
			return;
		}

		const firstSchema = aiSchemas[0];
		setSelectedSchemaKey(firstSchema.key);
		setSelectedPaths(buildDefaultSelectedPaths(firstSchema, fieldMeta, ui));
	}, [aiSchemas, fieldMeta, selectedSchemaKey, ui]);

	const selectedSchema = aiSchemas.find(
		(schema) => schema.key === selectedSchemaKey,
	);
	const hiddenPathSet = toNormalizedSet(ui.hiddenPaths);
	const readOnlyPathSet = toNormalizedSet(ui.readOnlyPaths);
	const disabledPathSet = toNormalizedSet(ui.disabledPaths);

	const fieldItems: FieldRuntimeMeta[] = [];
	const selectablePaths: string[] = [];
	for (const path of selectedSchema?.paths ?? []) {
		const normalizedPath = normalizePath(path);
		const meta = findFieldMeta(path, fieldMeta);
		const fillable = meta?.ai?.fillable ?? false;
		const isHidden = hiddenPathSet.has(normalizedPath);
		const isReadOnly = readOnlyPathSet.has(normalizedPath);
		const isDisabled = disabledPathSet.has(normalizedPath);
		const selectable = fillable && !isHidden && !isReadOnly && !isDisabled;

		const runtimeMeta: FieldRuntimeMeta = {
			path,
			label: meta?.label ?? path,
			reason: meta?.ai?.reason,
			optionCount:
				options[path]?.length ?? options[normalizedPath]?.length ?? 0,
			fillable,
			isHidden,
			isReadOnly,
			isDisabled,
			selectable,
		};
		fieldItems.push(runtimeMeta);
		if (selectable) {
			selectablePaths.push(path);
		}
	}

	const handleSchemaSelectionChange = (keys: SharedSelection) => {
		if (keys === "all") {
			return;
		}

		const schemaKey = Array.from(keys)[0] as string | undefined;
		if (!schemaKey) {
			return;
		}

		const nextSchema = aiSchemas.find((schema) => schema.key === schemaKey);
		if (!nextSchema) {
			return;
		}

		setSelectedSchemaKey(schemaKey);
		setSelectedPaths(buildDefaultSelectedPaths(nextSchema, fieldMeta, ui));
		setErrorMessage(null);
	};

	const selectedPathSet = new Set(
		selectedPaths.map((path) => normalizePath(path)),
	);

	const handleFieldChipToggle = (path: string) => {
		const field = fieldItems.find((item) => item.path === path);
		if (!field || !field.selectable || disabled || isLoading) {
			return;
		}

		const normalizedPath = normalizePath(path);
		const alreadySelected = selectedPathSet.has(normalizedPath);
		if (alreadySelected) {
			setSelectedPaths(
				selectedPaths.filter(
					(itemPath) => normalizePath(itemPath) !== normalizedPath,
				),
			);
		} else {
			setSelectedPaths([...selectedPaths, path]);
		}
		setErrorMessage(null);
	};

	const handleFill = async () => {
		if (!selectedSchema) {
			setErrorMessage("채울 스키마를 선택해주세요.");
			return;
		}

		if (selectedPaths.length === 0) {
			setErrorMessage("AI가 채울 필드를 최소 1개 이상 선택해주세요.");
			return;
		}

		setIsLoading(true);
		setErrorMessage(null);

		try {
			const response = await onFill({
				schemaKey: selectedSchema.key,
				selectedPaths,
				currentObject: formState,
				userPrompt: userPrompt.trim() || undefined,
			});

			const safePatches = sanitizePatches(
				response.patches,
				selectedPaths,
				fieldMeta,
				ui,
			);
			if (safePatches.length === 0) {
				setErrorMessage("적용 가능한 AI 결과가 없습니다.");
				setLastAppliedCount(0);
				return;
			}

			applyPatch(safePatches);
			onRevalidate?.();
			setLastAppliedCount(safePatches.length);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "AI 폼 채우기 요청 처리 중 오류가 발생했습니다.";
			setErrorMessage(message);
			setLastAppliedCount(0);
		} finally {
			setIsLoading(false);
		}
	};

	const selectedSchemaKeys = selectedSchemaKey
		? new Set<string>([selectedSchemaKey])
		: new Set<string>();
	const isFillDisabled =
		disabled || isLoading || !selectedSchema || selectedPaths.length === 0;

	return (
		<Card shadow="sm" className="border border-divider bg-content1">
			<CardBody className="gap-2 p-2.5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5">
						<Sparkles className="size-3.5 text-primary" />
						<h3 className="text-xs font-semibold">지능형 채움</h3>
					</div>
					<Chip size="sm" variant="flat" color="primary">
						선택 {selectedPaths.length}
					</Chip>
				</div>

				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<Select
						aria-label="AI 스키마"
						size="sm"
						placeholder="AI 스키마 선택"
						selectedKeys={selectedSchemaKeys}
						onSelectionChange={handleSchemaSelectionChange}
						isDisabled={disabled || aiSchemas.length === 0}
						className="flex-1"
					>
						{aiSchemas.map((schema) => (
							<SelectItem key={schema.key} textValue={schema.label}>
								{schema.label}
							</SelectItem>
						))}
					</Select>

					<div className="flex items-center gap-1.5">
						<Button
							size="sm"
							variant="light"
							onPress={() => {
								setIsFieldPanelOpen(!isFieldPanelOpen);
							}}
							endContent={
								isFieldPanelOpen ? (
									<ChevronUp className="size-4" />
								) : (
									<ChevronDown className="size-4" />
								)
							}
							isDisabled={disabled || fieldItems.length === 0}
						>
							필드
						</Button>
						<Button
							size="sm"
							color="primary"
							variant="flat"
							onPress={handleFill}
							isLoading={isLoading}
							isDisabled={isFillDisabled}
							startContent={!isLoading && <Sparkles className="size-3.5" />}
						>
							채우기
						</Button>
					</div>
				</div>

				<AnimatePresence initial={false}>
					{isFieldPanelOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0, y: -8 }}
							animate={{ opacity: 1, height: "auto", y: 0 }}
							exit={{ opacity: 0, height: 0, y: -8 }}
							transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
							className="overflow-hidden"
						>
							<div className="rounded-md border border-divider p-2">
								<Input
									aria-label="추가 요청사항"
									size="sm"
									placeholder="추가 요청사항 (선택)"
									value={userPrompt}
									onValueChange={setUserPrompt}
									isDisabled={disabled || isLoading}
								/>
								<div className="mt-2 max-h-32 overflow-y-auto rounded-md border border-divider p-2">
									{fieldItems.length === 0 ? (
										<p className="text-xs text-default-500">
											선택 가능한 필드가 없습니다.
										</p>
									) : (
										<div className="flex flex-wrap gap-1.5">
											{fieldItems.map((item) => {
												const statusText = buildFieldStatus(item);
												const normalizedPath = normalizePath(item.path);
												const isSelected = selectedPathSet.has(normalizedPath);
												return (
													<motion.div
														key={item.path}
														layout
														initial={false}
														animate={{ scale: isSelected ? 1 : 0.98 }}
														whileTap={
															item.selectable ? { scale: 0.95 } : undefined
														}
														transition={{ duration: 0.16 }}
													>
														<Chip
															size="sm"
															variant={isSelected ? "solid" : "flat"}
															color={
																isSelected
																	? "primary"
																	: item.selectable
																		? "default"
																		: "warning"
															}
															className={`max-w-[180px] cursor-pointer text-[11px] transition-all duration-200 ${
																!item.selectable
																	? "cursor-not-allowed opacity-60"
																	: ""
															}`}
															title={[
																item.label,
																statusText ? `상태: ${statusText}` : "",
																item.reason ? `사유: ${item.reason}` : "",
															]
																.filter(Boolean)
																.join("\n")}
															onClick={() => {
																handleFieldChipToggle(item.path);
															}}
														>
															<span className="truncate">
																{item.label}
																{item.optionCount > 0
																	? ` (${item.optionCount})`
																	: ""}
															</span>
														</Chip>
													</motion.div>
												);
											})}
										</div>
									)}
								</div>
								<p className="mt-1 text-[11px] text-default-500">
									선택 {selectedPaths.length}/{selectablePaths.length}
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}

				{lastAppliedCount > 0 && (
					<p className="text-[11px] text-default-500">
						적용 완료: {lastAppliedCount}개 필드
					</p>
				)}
			</CardBody>
		</Card>
	);
};

export const AiForm = observer(AiFormComponent) as typeof AiFormComponent & {
	displayName?: string;
};
AiForm.displayName = "AiForm";
