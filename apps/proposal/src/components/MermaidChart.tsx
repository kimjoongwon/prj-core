"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
	chart: string;
	className?: string;
}

mermaid.initialize({
	startOnLoad: false,
	theme: "dark",
	themeVariables: {
		primaryColor: "#7c3aed",
		primaryTextColor: "#fff",
		primaryBorderColor: "#9333ea",
		lineColor: "#6b7280",
		secondaryColor: "#1f2937",
		tertiaryColor: "#374151",
	},
});

export function MermaidChart({ chart, className = "" }: MermaidChartProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const renderChart = async () => {
			if (containerRef.current) {
				containerRef.current.innerHTML = "";
				const { svg } = await mermaid.render(
					`mermaid-${Date.now()}`,
					chart,
				);
				containerRef.current.innerHTML = svg;
			}
		};
		renderChart();
	}, [chart]);

	return (
		<div
			ref={containerRef}
			className={`mermaid-container overflow-auto ${className}`}
		/>
	);
}
