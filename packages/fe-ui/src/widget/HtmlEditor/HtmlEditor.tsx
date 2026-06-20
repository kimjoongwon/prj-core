"use client";

import { Spinner } from "@heroui/react";
import type { Editor, EditorConfig, EventInfo } from "ckeditor5";
import { observer } from "mobx-react-lite";
import {
	type ComponentType,
	type CSSProperties,
	useEffect,
	useState,
} from "react";

type Ckeditor5Module = typeof import("ckeditor5");
type CkeditorKoTranslationModule =
	typeof import("ckeditor5/translations/ko.js");

interface CkeditorModules {
	CKEditor: ComponentType<Record<string, unknown>>;
	ClassicEditor: Ckeditor5Module["ClassicEditor"];
	plugins: NonNullable<EditorConfig["plugins"]>;
	koTranslation: CkeditorKoTranslationModule["default"];
}

export interface HtmlEditorProps {
	/** HTML 값 */
	value: string;
	/** 값 변경 핸들러 */
	onChange: (value: string) => void;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 최소 높이 (px) */
	minHeight?: number;
	/** 에디터 라벨 */
	label?: string;
	/** 도움말 */
	description?: string;
	/** 읽기 전용 여부 */
	isDisabled?: boolean;
	/** CKEditor 5 license key. GPL self-hosting은 "GPL"을 사용한다. */
	licenseKey?: string;
	/** 추가 클래스명 */
	className?: string;
}

const DEFAULT_LICENSE_KEY = "GPL";

/**
 * HtmlEditor 컴포넌트
 * 약관/동의 문서의 HTML 본문을 CKEditor 5 WYSIWYG 편집기로 작성한다.
 */
export const HtmlEditor = observer(
	({
		value,
		onChange,
		placeholder = "본문을 작성하세요.",
		minHeight = 360,
		label = "HTML 본문",
		description = "제목, 목록, 링크, 표를 포함한 약관 본문을 편집할 수 있습니다.",
		isDisabled = false,
		licenseKey = DEFAULT_LICENSE_KEY,
		className,
	}: HtmlEditorProps) => {
		const [editorModules, setEditorModules] = useState<CkeditorModules | null>(
			null,
		);
		const [loadError, setLoadError] = useState<string | null>(null);
		const editorStyle = {
			"--html-editor-min-height": `${minHeight}px`,
		} as CSSProperties;

		useEffect(() => {
			let isActive = true;

			const loadEditor = async () => {
				try {
					const [reactModule, ckeditorModule, koTranslationModule] =
						await Promise.all([
							import("@ckeditor/ckeditor5-react"),
							import("ckeditor5"),
							import("ckeditor5/translations/ko.js"),
						]);

					if (!isActive) return;

					setEditorModules({
						CKEditor: reactModule.CKEditor as unknown as ComponentType<
							Record<string, unknown>
						>,
						ClassicEditor: ckeditorModule.ClassicEditor,
						plugins: [
							ckeditorModule.Essentials,
							ckeditorModule.Paragraph,
							ckeditorModule.Heading,
							ckeditorModule.Bold,
							ckeditorModule.Italic,
							ckeditorModule.Underline,
							ckeditorModule.Link,
							ckeditorModule.AutoLink,
							ckeditorModule.List,
							ckeditorModule.BlockQuote,
							ckeditorModule.Table,
							ckeditorModule.TableToolbar,
							ckeditorModule.HorizontalLine,
							ckeditorModule.Alignment,
							ckeditorModule.SourceEditing,
						],
						koTranslation: koTranslationModule.default,
					});
				} catch (error) {
					if (!isActive) return;

					setLoadError(
						error instanceof Error
							? error.message
							: "CKEditor를 불러오지 못했습니다.",
					);
				}
			};

			void loadEditor();

			return () => {
				isActive = false;
			};
		}, []);

		const handleEditorChange = (_event: EventInfo, editor: Editor) => {
			onChange(editor.getData());
		};

		const handleEditorError = (error: Error) => {
			setLoadError(error.message);
		};

		if (loadError) {
			return (
				<div
					className={`rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger ${className ?? ""}`}
					style={{ minHeight }}
				>
					<p key="error-label" className="font-medium">
						{label}
					</p>
					<p key="error-message" className="mt-2">
						CKEditor 초기화 중 오류가 발생했습니다.
					</p>
					<p key="error-detail" className="mt-1 break-words text-xs opacity-80">
						{loadError}
					</p>
				</div>
			);
		}

		if (!editorModules) {
			return (
				<div
					className={`flex items-center justify-center rounded-lg border border-border bg-surface text-muted ${className ?? ""}`}
					style={{ minHeight }}
				>
					<div className="flex items-center gap-3 text-sm">
						<Spinner size="sm" />
						<span>HTML 편집기를 불러오는 중</span>
					</div>
				</div>
			);
		}

		const { CKEditor, ClassicEditor, plugins, koTranslation } = editorModules;
		const config: EditorConfig = {
			language: "ko",
			licenseKey,
			placeholder,
			plugins,
			toolbar: {
				items: [
					"undo",
					"redo",
					"|",
					"heading",
					"|",
					"bold",
					"italic",
					"underline",
					"link",
					"|",
					"bulletedList",
					"numberedList",
					"alignment",
					"|",
					"blockQuote",
					"insertTable",
					"horizontalLine",
					"|",
					"sourceEditing",
				],
				shouldNotGroupWhenFull: false,
			},
			heading: {
				options: [
					{
						model: "paragraph",
						title: "문단",
						class: "ck-heading_paragraph",
					},
					{
						model: "heading2",
						view: "h2",
						title: "제목 2",
						class: "ck-heading_heading2",
					},
					{
						model: "heading3",
						view: "h3",
						title: "제목 3",
						class: "ck-heading_heading3",
					},
					{
						model: "heading4",
						view: "h4",
						title: "제목 4",
						class: "ck-heading_heading4",
					},
				],
			},
			link: {
				addTargetToExternalLinks: true,
				defaultProtocol: "https://",
			},
			table: {
				contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
			},
			translations: [koTranslation],
		};

		return (
			<div
				className={`service-document-html-editor ${className ?? ""}`}
				style={editorStyle}
			>
				<div className="mb-2">
					<p key="label" className="text-sm font-medium text-foreground">
						{label}
					</p>
					{description ? (
						<p key="description" className="mt-1 text-xs text-muted">
							{description}
						</p>
					) : null}
				</div>
				<div className="service-document-html-editor__surface">
					<CKEditor
						editor={ClassicEditor}
						data={value}
						disabled={isDisabled}
						config={config}
						onChange={handleEditorChange}
						onError={handleEditorError}
					/>
				</div>
			</div>
		);
	},
);

HtmlEditor.displayName = "HtmlEditor";
