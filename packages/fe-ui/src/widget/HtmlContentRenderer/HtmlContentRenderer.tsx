"use client";

import { observer } from "mobx-react-lite";

export interface HtmlContentRendererProps {
	/** 렌더링할 HTML 문자열 */
	html: string;
	/** 최대 높이 (px) */
	maxHeight?: number;
}

/** script 태그를 제거하여 XSS를 방지합니다 */
const sanitizeHtml = (html: string): string => {
	return html.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		"",
	);
};

/**
 * EMAIL 유형의 HTML 본문을 안전하게 렌더링하는 위젯
 *
 * iframe sandbox를 활용하여 격리된 환경에서 HTML을 표시합니다.
 * 스크립트 태그는 사전 제거되며, sandbox 속성으로 스크립트 실행을 차단합니다.
 */
export const HtmlContentRenderer = observer(
	({ html, maxHeight = 400 }: HtmlContentRendererProps) => {
		const sanitized = sanitizeHtml(html);

		return (
			<div
				className="border border-border rounded-lg overflow-hidden"
				style={{ maxHeight }}
			>
				<iframe
					srcDoc={sanitized}
					sandbox="allow-same-origin"
					title="HTML 콘텐츠"
					style={{
						width: "100%",
						height: maxHeight,
						border: "none",
						background: "white",
					}}
				/>
			</div>
		);
	},
);

HtmlContentRenderer.displayName = "HtmlContentRenderer";
