"use client";

import { observer } from "mobx-react-lite";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
	/** 마크다운 내용 */
	content: string;
}

/**
 * 마크다운 프리뷰 컴포넌트
 */
export const MarkdownPreview = observer(({ content }: MarkdownPreviewProps) => {
	if (!content.trim()) {
		return (
			<div className="flex h-full items-center justify-center text-default-400">
				<p>마크다운 내용이 없습니다</p>
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto p-6">
			<article className="prose prose-invert max-w-none prose-headings:text-default-800 prose-h1:border-b prose-h1:border-divider prose-h1:pb-2 prose-h2:text-xl prose-h3:text-lg prose-p:text-default-600 prose-a:text-primary prose-strong:text-default-800 prose-code:rounded prose-code:bg-content2 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-default-700 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-content2 prose-pre:text-default-700 prose-ol:text-default-600 prose-ul:text-default-600 prose-li:marker:text-default-400 prose-table:border-collapse prose-th:border prose-th:border-divider prose-th:bg-content2 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-default-700 prose-td:border prose-td:border-divider prose-td:px-3 prose-td:py-2 prose-td:text-default-600 prose-hr:border-divider">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
			</article>
		</div>
	);
});
