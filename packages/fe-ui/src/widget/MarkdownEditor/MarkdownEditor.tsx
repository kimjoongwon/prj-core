"use client";

import { Button, Tooltip } from "@cocrepo/ui/heroui";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Link,
	List,
	ListOrdered,
	Minus,
	Quote,
	Table,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { useRef } from "react";

interface ToolbarItem {
	icon?: React.ComponentType<{ className?: string }>;
	label: string;
	action: () => void;
	type?: never;
}

interface ToolbarDivider {
	type: "divider";
	icon?: never;
	label?: never;
	action?: never;
}

type ToolbarItemOrDivider = ToolbarItem | ToolbarDivider;

export interface MarkdownEditorProps {
	/** 마크다운 내용 */
	value: string;
	/** 변경 핸들러 */
	onChange: (value: string) => void;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 추가 툴바 버튼 */
	extraToolbarItems?: ToolbarItemOrDivider[];
	/** 추가 툴바 액션 버튼 (우측) */
	extraActions?: ReactNode;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * MarkdownEditor 컴포넌트
 * 툴바를 통해 마크다운 문법을 쉽게 삽입할 수 있는 에디터입니다.
 * 제목, 굵게, 기울임, 코드, 목록, 테이블 등의 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <MarkdownEditor
 *   value={markdown}
 *   onChange={setMarkdown}
 *   placeholder="내용을 작성하세요..."
 *   extraActions={<Button onPress={save}>저장</Button>}
 * />
 * ```
 */
export const MarkdownEditor = observer(
	({
		value,
		onChange,
		placeholder = "내용을 작성하세요...",
		extraToolbarItems = [],
		extraActions,
		className,
	}: MarkdownEditorProps) => {
		const textareaRef = useRef<HTMLTextAreaElement>(null);

		// 텍스트 삽입 헬퍼
		const insertText = (before: string, after = "", placeholderText = "") => {
			const textarea = textareaRef.current;
			if (!textarea) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const selectedText = value.substring(start, end) || placeholderText;

			const newValue =
				value.substring(0, start) +
				before +
				selectedText +
				after +
				value.substring(end);

			onChange(newValue);

			// 커서 위치 조정
			setTimeout(() => {
				textarea.focus();
				const newCursorPos = start + before.length + selectedText.length;
				textarea.setSelectionRange(newCursorPos, newCursorPos);
			}, 0);
		};

		// 라인 시작에 삽입
		const insertAtLineStart = (prefix: string) => {
			const textarea = textareaRef.current;
			if (!textarea) return;

			const start = textarea.selectionStart;
			const lineStart = value.lastIndexOf("\n", start - 1) + 1;

			const newValue =
				value.substring(0, lineStart) + prefix + value.substring(lineStart);

			onChange(newValue);

			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(
					start + prefix.length,
					start + prefix.length,
				);
			}, 0);
		};

		// 테이블 삽입
		const insertTable = () => {
			const table = `
| 컬럼1 | 컬럼2 | 컬럼3 |
|-------|-------|-------|
|       |       |       |
|       |       |       |
`;
			insertText(table);
		};

		const defaultToolbarItems: ToolbarItemOrDivider[] = [
			{
				icon: Heading1,
				label: "제목 1",
				action: () => insertAtLineStart("# "),
			},
			{
				icon: Heading2,
				label: "제목 2",
				action: () => insertAtLineStart("## "),
			},
			{
				icon: Heading3,
				label: "제목 3",
				action: () => insertAtLineStart("### "),
			},
			{ type: "divider" },
			{
				icon: Bold,
				label: "굵게",
				action: () => insertText("**", "**", "텍스트"),
			},
			{
				icon: Italic,
				label: "기울임",
				action: () => insertText("*", "*", "텍스트"),
			},
			{
				icon: Code,
				label: "코드",
				action: () => insertText("`", "`", "코드"),
			},
			{ type: "divider" },
			{
				icon: List,
				label: "목록",
				action: () => insertAtLineStart("- "),
			},
			{
				icon: ListOrdered,
				label: "번호 목록",
				action: () => insertAtLineStart("1. "),
			},
			{
				icon: Quote,
				label: "인용",
				action: () => insertAtLineStart("> "),
			},
			{ type: "divider" },
			{ icon: Table, label: "테이블", action: insertTable },
			{ icon: Minus, label: "구분선", action: () => insertText("\n---\n") },
			{
				icon: Link,
				label: "링크",
				action: () => insertText("[", "](url)", "링크 텍스트"),
			},
		];

		const allToolbarItems = [...defaultToolbarItems, ...extraToolbarItems];

		return (
			<div className={`flex h-full flex-col ${className ?? ""}`}>
				{/* 툴바 */}
				<div className="flex flex-wrap items-center gap-1 border-b border-divider bg-content2 p-2">
					{allToolbarItems.map((item, index) =>
						item.type === "divider" ? (
							<div key={index} className="mx-1 h-6 w-px bg-divider" />
						) : (
							<Tooltip key={index} content={item.label}>
								<Button
									size="sm"
									variant="light"
									isIconOnly
									onPress={item.action}
									className="size-8 min-w-8"
								>
									{item.icon && <item.icon className="size-4" />}
								</Button>
							</Tooltip>
						),
					)}
					{extraActions && (
						<>
							<div className="mx-1 h-6 w-px bg-divider" />
							{extraActions}
						</>
					)}
				</div>

				{/* 에디터 */}
				<textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="flex-1 resize-none bg-content1 p-4 font-mono text-sm text-default-800 outline-none placeholder:text-default-400"
					spellCheck={false}
				/>
			</div>
		);
	},
);
