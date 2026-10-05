"use client";

import type {
	DataGridEditCellContext,
	DataGridEditorConfig,
	DataGridEditorOption,
} from "@cocrepo/type";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { Typography } from "../../../data-display/Typography";

interface EditorCellProps<TData, TValue> {
	config: DataGridEditorConfig;
	context: DataGridEditCellContext<TData, TValue>;
}

const EDITOR_CLASS_NAME =
	"box-border h-9 min-w-0 w-full overflow-x-auto rounded-none border border-field-border-focus bg-field px-2 text-[13px] text-field-foreground outline-none focus-field-ring";

function getOptions(config: DataGridEditorConfig) {
	return config.options ?? [];
}

function getDatalistId(field: string) {
	return `data-grid-editor-${field.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function EditorError({ message }: { message?: string }) {
	return message ? (
		<Typography
			className="absolute left-0 top-full z-20 mt-1 whitespace-nowrap rounded bg-danger px-2 py-1 text-danger-foreground shadow-overlay"
			type="body-xs"
		>
			{message}
		</Typography>
	) : null;
}

function getTextValue(value: unknown) {
	return value == null ? "" : String(value);
}

export function EditorCell<TData, TValue>({
	config,
	context,
}: EditorCellProps<TData, TValue>) {
	const { type, placeholder } = config;
	const {
		value,
		errorMessage,
		isValidating,
		onValueChange,
		onFinish,
		onCancel,
	} = context;
	const label = context.field;
	const ariaInvalid = Boolean(errorMessage);

	const handleKeyDown = (
		event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			onCancel();
			return;
		}
		if (event.key === "Enter") {
			event.preventDefault();
			event.stopPropagation();
			onFinish();
			return;
		}
		if (event.key === "Tab") {
			onFinish(event.shiftKey ? "previous" : "next");
		}
	};

	const wrapper = (control: ReactNode) => (
		<div className="relative flex min-w-0 w-full items-center overflow-visible">
			{control}
			<EditorError message={errorMessage} />
		</div>
	);

	if (type === "boolean") {
		return wrapper(
			<input
				aria-label={label}
				aria-invalid={ariaInvalid}
				className="mx-auto size-4 accent-current text-accent"
				type="checkbox"
				checked={Boolean(value)}
				disabled={isValidating}
				onChange={(event) => {
					onValueChange(event.currentTarget.checked as TValue);
					onFinish();
				}}
				onKeyDown={handleKeyDown}
			/>,
		);
	}

	if (type === "select" || type === "multi-select") {
		const multiple = type === "multi-select";
		const selectedValues = new Set(
			Array.isArray(value) ? value.map(String) : [getTextValue(value)],
		);

		return wrapper(
			<select
				aria-label={label}
				aria-invalid={ariaInvalid}
				className={`${EDITOR_CLASS_NAME} ${multiple ? "h-20" : ""}`}
				multiple={multiple}
				disabled={isValidating}
				value={multiple ? Array.from(selectedValues) : getTextValue(value)}
				onChange={(event: ChangeEvent<HTMLSelectElement>) => {
					const nextValue = multiple
						? Array.from(event.currentTarget.selectedOptions).map(
								(option) => option.value,
							)
						: event.currentTarget.value;
					onValueChange(nextValue as TValue);
					onFinish();
				}}
				onKeyDown={handleKeyDown}
			>
				{!multiple && config.allowEmpty !== false ? (
					<option value="">{placeholder ?? "선택"}</option>
				) : null}
				{getOptions(config).map((option: DataGridEditorOption) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>,
		);
	}

	const inputType =
		type === "number"
			? "number"
			: type === "date"
				? "date"
				: type === "date-time"
					? "datetime-local"
					: "text";
	const datalistId = getDatalistId(label);

	return wrapper(
		<>
			<input
				aria-label={label}
				aria-invalid={ariaInvalid}
				className={EDITOR_CLASS_NAME}
				disabled={isValidating}
				list={type === "autocomplete" ? datalistId : undefined}
				placeholder={placeholder}
				type={inputType}
				value={getTextValue(value)}
				onChange={(event) => {
					const nextValue = event.currentTarget.value;
					const normalizedValue =
						type === "number" && nextValue !== ""
							? Number(nextValue)
							: nextValue;
					onValueChange(normalizedValue as TValue);
				}}
				onKeyDown={handleKeyDown}
				onBlur={() => onFinish()}
			/>
			{type === "autocomplete" ? (
				<datalist id={datalistId}>
					{getOptions(config).map((option: DataGridEditorOption) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</datalist>
			) : null}
		</>,
	);
}
