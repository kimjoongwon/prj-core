"use client";

import {
	Button,
	Card,
	CardBody,
	Checkbox,
	CheckboxGroup,
	Chip,
	Divider,
	Input,
	Select,
	SelectItem,
	type SharedSelection,
} from "@heroui/react";
import { Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import type {
	AiFormFieldMeta,
	AiFormPatch,
	AiFormSchema,
	AiFormUiPaths,
} from "./types";
import type { AiFormProps } from "./types";

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
	return hidden.has(normalized) || readOnly.has(normalized) || disabled.has(normalized);
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
	const selectedPathSet = new Set(selectedPaths.map((path) => normalizePath(path)));
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

	useEffect(() => {
		if (aiSchemas.length === 0) {
			setSelectedSchemaKey("");
			setSelectedPaths([]);
			return;
		}

		const hasCurrent = aiSchemas.some((schema) => schema.key === selectedSchemaKey);
		if (hasCurrent) {
			return;
		}

		const firstSchema = aiSchemas[0];
		setSelectedSchemaKey(firstSchema.key);
		setSelectedPaths(buildDefaultSelectedPaths(firstSchema, fieldMeta, ui));
	}, [aiSchemas, fieldMeta, selectedSchemaKey, ui]);

	const selectedSchema = aiSchemas.find((schema) => schema.key === selectedSchemaKey);
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
			optionCount: options[path]?.length ?? options[normalizedPath]?.length ?? 0,
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

	const handlePathSelectionChange = (values: string[]) => {
		const selectablePathSet = new Set(selectablePaths.map((path) => normalizePath(path)));
		const nextSelected = values.filter((path) =>
			selectablePathSet.has(normalizePath(path)),
		);
		setSelectedPaths(nextSelected);
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

			const safePatches = sanitizePatches(response.patches, selectedPaths, fieldMeta, ui);
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
			<CardBody className="gap-4 p-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Sparkles className="size-4 text-primary" />
						<h3 className="text-sm font-semibold">AiForm</h3>
						<Chip size="sm" variant="flat" color="primary">
							선택 필드 {selectedPaths.length}개
						</Chip>
					</div>
					<p className="text-xs text-default-500">
						스키마와 필드를 선택한 뒤 AI 채우기를 실행하세요.
					</p>
				</div>

				<div className="grid gap-3 md:grid-cols-2">
					<Select
						label="AI 스키마"
						labelPlacement="outside"
						placeholder="스키마를 선택하세요"
						selectedKeys={selectedSchemaKeys}
						onSelectionChange={handleSchemaSelectionChange}
						isDisabled={disabled || aiSchemas.length === 0}
					>
						{aiSchemas.map((schema) => (
							<SelectItem key={schema.key} textValue={schema.label}>
								{schema.label}
							</SelectItem>
						))}
					</Select>

					<Input
						label="추가 요청사항"
						labelPlacement="outside"
						placeholder="선택 사항"
						value={userPrompt}
						onValueChange={setUserPrompt}
						isDisabled={disabled || isLoading}
					/>
				</div>

				<Divider />

				<div className="max-h-56 overflow-y-auto rounded-lg border border-divider p-3">
					{fieldItems.length === 0 ? (
						<p className="text-sm text-default-500">
							선택한 스키마에 표시할 필드가 없습니다.
						</p>
					) : (
						<CheckboxGroup
							value={selectedPaths}
							onValueChange={handlePathSelectionChange}
							classNames={{ wrapper: "gap-3" }}
						>
							{fieldItems.map((item) => (
								<div key={item.path} className="rounded-lg border border-divider p-3">
									<Checkbox
										value={item.path}
										isDisabled={disabled || !item.selectable}
									>
										<span className="text-sm font-medium">{item.label}</span>
									</Checkbox>
									<div className="mt-2 flex flex-wrap gap-2">
										{item.isHidden && (
											<Chip size="sm" variant="flat" color="warning">
												hidden
											</Chip>
										)}
										{item.isReadOnly && (
											<Chip size="sm" variant="flat" color="warning">
												readOnly
											</Chip>
										)}
										{item.isDisabled && (
											<Chip size="sm" variant="flat" color="warning">
												disabled
											</Chip>
										)}
										{!item.fillable && (
											<Chip size="sm" variant="flat" color="default">
												ai-fillable=false
											</Chip>
										)}
										{item.optionCount > 0 && (
											<Chip size="sm" variant="flat" color="default">
												options {item.optionCount}
											</Chip>
										)}
									</div>
									{item.reason && (
										<p className="mt-2 text-xs text-default-500">{item.reason}</p>
									)}
								</div>
							))}
						</CheckboxGroup>
					)}
				</div>

				{errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

				<div className="flex items-center justify-between">
					<span className="text-xs text-default-500">
						적용 완료: {lastAppliedCount}개 필드
					</span>
					<Button
						color="primary"
						variant="flat"
						onPress={handleFill}
						isLoading={isLoading}
						isDisabled={isFillDisabled}
						startContent={!isLoading && <Sparkles className="size-4" />}
					>
						AI 채우기
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};

export const AiForm = observer(AiFormComponent) as typeof AiFormComponent & {
	displayName?: string;
};
AiForm.displayName = "AiForm";
