"use client";

import type { DataGridEditorConfig } from "@cocrepo/type";
import type { ReactNode } from "react";
import { Typography } from "../../../data-display/Typography";
import { useHandlers } from "./useHandlers";

interface EditorCellContext<TData, TValue> {
	row: TData;
	field: string;
	value: TValue;
	initialValue: TValue;
	errorMessage?: string;
	isValidating: boolean;
	onValueChange: (value: TValue) => void;
	onFinish: (direction?: "next" | "previous") => void;
	onCancel: () => void;
}

export interface EditorCellProps<TData, TValue> {
	config: DataGridEditorConfig;
	context: EditorCellContext<TData, TValue>;
}

const EDITOR_CLASS_NAME =
	"box-border h-9 min-w-0 w-full overflow-x-auto rounded-none border border-field-border-focus bg-field px-2 text-[13px] text-field-foreground outline-none focus-field-ring";

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

function EditorControl({
	children,
	errorMessage,
}: {
	children: ReactNode;
	errorMessage?: string;
}) {
	return (
		<div className="relative flex min-w-0 w-full items-center overflow-visible">
			{children}
			<EditorError message={errorMessage} />
		</div>
	);
}

export function EditorCell<TData, TValue>(
	state: EditorCellProps<TData, TValue>,
) {
	const { config, context } = state;
	const { type, placeholder } = config;
	const { value, errorMessage, isValidating } = context;
	const label = context.field;
	const ariaInvalid = Boolean(errorMessage);
	const handlers = useHandlers(state);
	const { options, selectedValues, textValue, datalistId, inputType } =
		handlers.getEditorPresentation();

	if (type === "boolean") {
		return (
			<EditorControl errorMessage={errorMessage}>
				<input
					aria-label={label}
					aria-invalid={ariaInvalid}
					className="mx-auto size-4 accent-current text-accent"
					type="checkbox"
					checked={Boolean(value)}
					disabled={isValidating}
					onChange={handlers.changeBoolean}
					onKeyDown={handlers.completeFromKeyboard}
				/>
			</EditorControl>
		);
	}

	if (type === "select" || type === "multi-select") {
		const multiple = type === "multi-select";
		return (
			<EditorControl errorMessage={errorMessage}>
				<select
					aria-label={label}
					aria-invalid={ariaInvalid}
					className={`${EDITOR_CLASS_NAME} ${multiple ? "h-20" : ""}`}
					multiple={multiple}
					disabled={isValidating}
					value={multiple ? selectedValues : textValue}
					onChange={handlers.changeSelection}
					onKeyDown={handlers.completeFromKeyboard}
				>
					{!multiple && config.allowEmpty !== false ? (
						<option value="">{placeholder ?? "선택"}</option>
					) : null}
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</EditorControl>
		);
	}

	return (
		<EditorControl errorMessage={errorMessage}>
			<input
				aria-label={label}
				aria-invalid={ariaInvalid}
				className={EDITOR_CLASS_NAME}
				disabled={isValidating}
				list={type === "autocomplete" ? datalistId : undefined}
				placeholder={placeholder}
				type={inputType}
				value={textValue}
				onChange={handlers.changeInput}
				onKeyDown={handlers.completeFromKeyboard}
				onBlur={handlers.finishFromBlur}
			/>
			{type === "autocomplete" ? (
				<datalist id={datalistId}>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</datalist>
			) : null}
		</EditorControl>
	);
}
