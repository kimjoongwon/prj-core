"use client";

import mermaid from "mermaid";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

export interface DiagramViewerProps {
	/** Mermaid 다이어그램 코드 */
	diagram: string;
	/** 테마 (기본: dark) */
	theme?: "dark" | "default" | "forest" | "neutral";
	/** 추가 CSS 클래스 */
	className?: string;
}

// Mermaid 초기화 (한 번만)
let initialized = false;

function initializeMermaid(theme: string) {
	if (initialized) return;

	mermaid.initialize({
		startOnLoad: false,
		theme: theme as "dark" | "default" | "forest" | "neutral",
		themeVariables: {
			primaryColor: "#7c3aed",
			primaryTextColor: "#fff",
			primaryBorderColor: "#9333ea",
			lineColor: "#6b7280",
			secondaryColor: "#1f2937",
			tertiaryColor: "#374151",
		},
	});

	initialized = true;
}

/**
 * DiagramViewer 컴포넌트
 * Mermaid 기반의 다이어그램을 시각화하는 뷰어입니다.
 * flowchart, sequence diagram 등 다양한 다이어그램을 지원합니다.
 *
 * @example
 * ```tsx
 * <DiagramViewer
 *   diagram={`
 *     flowchart LR
 *       A[시작] --> B[처리]
 *       B --> C[종료]
 *   `}
 *   theme="dark"
 * />
 * ```
 */
export const DiagramViewer = observer(
	({ diagram, theme = "dark", className = "" }: DiagramViewerProps) => {
		const containerRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			initializeMermaid(theme);

			const renderChart = async () => {
				if (containerRef.current && diagram) {
					containerRef.current.innerHTML = "";
					try {
						const { svg } = await mermaid.render(
							`mermaid-${Date.now()}`,
							diagram,
						);
						containerRef.current.innerHTML = svg;
					} catch (error) {
						console.error("Failed to render diagram:", error);
						containerRef.current.innerHTML = `<p class="text-danger">다이어그램 렌더링 실패</p>`;
					}
				}
			};

			renderChart();
		}, [diagram, theme]);

		return (
			<div
				ref={containerRef}
				className={`diagram-container overflow-auto ${className}`}
			/>
		);
	},
);
