"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { Typography } from "../../data-display/Typography";

export interface HtmlEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	minHeight?: number;
	label?: string;
	description?: string;
	isDisabled?: boolean;
	isInvalid?: boolean;
	errorMessage?: string;
	className?: string;
}

const removeScriptTags = (html: string): string =>
	html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

const executeEditorCommand = (command: string) => {
	document.execCommand(command, false);
};

/** 브라우저 표준 contentEditable 기반 HTML 입력 primitive입니다. */
export const HtmlEditor = observer(
	({
		value,
		onChange,
		placeholder = "본문을 작성하세요.",
		minHeight = 360,
		label = "HTML 본문",
		description = "제목, 목록, 링크, 표를 포함한 약관 본문을 편집할 수 있습니다.",
		isDisabled = false,
		isInvalid = false,
		errorMessage,
		className,
	}: HtmlEditorProps) => {
		const editorRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const editorElement = editorRef.current;
			if (editorElement && editorElement.innerHTML !== value) {
				editorElement.innerHTML = removeScriptTags(value);
			}
		}, [value]);

		const handleInput = () => {
			const editorElement = editorRef.current;
			if (editorElement) onChange(removeScriptTags(editorElement.innerHTML));
		};

		const handleToolbarMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			executeEditorCommand(event.currentTarget.dataset.command ?? "");
			editorRef.current?.focus();
		};

		return (
			<div
				className={`service-document-html-editor ${className ?? ""}`}
				data-invalid={isInvalid || undefined}
				style={{ "--html-editor-min-height": `${minHeight}px` } as CSSProperties}
			>
				<div className="mb-2">
					<label className="text-sm font-medium text-foreground">{label}</label>
					{description ? (
						<Typography.Paragraph className="mt-1" color="muted" size="xs">
							{description}
						</Typography.Paragraph>
					) : null}
				</div>
				<div className="service-document-html-editor__surface">
					<div className="service-document-html-editor__toolbar" role="toolbar" aria-label="HTML 서식">
						{[
							["bold", "굵게"],
							["italic", "기울임"],
							["underline", "밑줄"],
							["insertUnorderedList", "글머리 기호"],
							["insertOrderedList", "번호 목록"],
						].map(([command, title]) => (
							<button type="button" key={command} data-command={command} disabled={isDisabled} onMouseDown={handleToolbarMouseDown} aria-label={title}>
								{title}
							</button>
						))}
					</div>
					{/* biome-ignore lint/a11y/useSemanticElements: contentEditable requires textbox semantics. */}
					<div
						ref={editorRef}
						className="service-document-html-editor__editable"
						contentEditable={!isDisabled}
						data-placeholder={placeholder}
						dangerouslySetInnerHTML={{ __html: removeScriptTags(value) }}
						onInput={handleInput}
						role="textbox"
						aria-multiline="true"
						aria-label={label}
						tabIndex={isDisabled ? -1 : 0}
						aria-invalid={isInvalid || undefined}
					/>
				</div>
				{isInvalid && errorMessage ? (
					<Typography.Paragraph className="mt-1 text-danger" size="sm">
						{errorMessage}
					</Typography.Paragraph>
				) : null}
			</div>
		);
	},
);

HtmlEditor.displayName = "HtmlEditor";
