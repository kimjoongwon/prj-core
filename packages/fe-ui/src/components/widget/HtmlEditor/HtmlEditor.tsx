"use client";

import { Textarea } from "@heroui/react";
import { Info } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface HtmlEditorProps {
	/** HTML 값 */
	value: string;
	/** 값 변경 핸들러 */
	onChange: (value: string) => void;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 최소 높이 (px) - minRows로 변환됩니다 */
	minHeight?: number;
}

/** 최소 높이(px)를 대략적인 minRows로 변환합니다 (1행 약 20px 기준) */
const toMinRows = (minHeight: number): number => {
	return Math.max(Math.round(minHeight / 20), 5);
};

/**
 * HtmlEditor 컴포넌트
 * EMAIL 유형의 HTML 본문을 편집하는 Textarea 기반 코드 에디터입니다.
 * {{변수명}} 형태의 변수 삽입을 안내하며, font-mono 스타일로 코드 편집 경험을 제공합니다.
 *
 * @example
 * ```tsx
 * <HtmlEditor
 *   value={htmlContent}
 *   onChange={setHtmlContent}
 *   placeholder="<html><body>내용을 작성하세요...</body></html>"
 * />
 * ```
 */
export const HtmlEditor = observer(
	({
		value,
		onChange,
		placeholder = "<html>\n<body>\n  내용을 작성하세요...\n</body>\n</html>",
		minHeight = 300,
	}: HtmlEditorProps) => {
		const handleChange = (val: string) => {
			onChange(val);
		};

		return (
			<div className="flex flex-col gap-2">
				<Textarea
					label="HTML 본문"
					value={value}
					onValueChange={handleChange}
					placeholder={placeholder}
					minRows={toMinRows(minHeight)}
					variant="bordered"
					description={
						<span className="inline-flex items-center gap-1">
							<Info className="size-3" />
							{"{{변수명}} 형태로 변수를 삽입할 수 있습니다"}
						</span>
					}
					classNames={{
						input: "font-mono text-sm",
						inputWrapper: "bg-content1",
					}}
					spellCheck={false}
				/>
			</div>
		);
	},
);

HtmlEditor.displayName = "HtmlEditor";
