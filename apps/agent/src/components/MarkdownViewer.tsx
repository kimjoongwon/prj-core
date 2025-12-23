"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
	title: string;
	type: string;
	content: string;
	onClose: () => void;
}

export function MarkdownViewer({
	title,
	type,
	content,
	onClose,
}: MarkdownViewerProps) {
	const typeLabels: Record<string, string> = {
		"claude-md": "CLAUDE.md",
		command: "Slash Command",
		hooks: "Hooks",
		subagent: "Subagent",
		skill: "Skill",
		mcp: "MCP",
		"qoder-wiki": "Qoder Wiki",
		"qoder-quest": "Qoder Quest",
	};

	const isJson = type === "hooks" || type === "mcp";

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				{/* 헤더 */}
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
					<div>
						<span className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wider">
							{typeLabels[type] || type}
						</span>
						<h2 className="text-xl font-bold">{title}</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* 콘텐츠 */}
				<div className="flex-1 overflow-auto p-6">
					{isJson ? (
						<pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl overflow-auto font-mono text-sm">
							{content}
						</pre>
					) : (
						<article className="prose prose-gray dark:prose-invert max-w-none">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>
								{content}
							</ReactMarkdown>
						</article>
					)}
				</div>

				{/* 푸터 */}
				<div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
					<button
						onClick={() => {
							navigator.clipboard.writeText(content);
						}}
						className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
					>
						복사
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
}
