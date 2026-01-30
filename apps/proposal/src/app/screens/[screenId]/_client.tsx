"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import { ArrowLeft, Download, Eye, Figma, FileCode, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";

import {
	DesignChat,
	FigmaEmbed,
	MarkdownEditor,
	MarkdownPreview,
} from "./components";

interface ScreenDesignClientProps {
	/** 화면 ID */
	screenId: string;
	/** 화면 정보 */
	screen: {
		id: string;
		name: string;
		description: string;
		path?: string;
	};
	/** 초기 마크다운 내용 */
	initialMarkdown: string;
	/** 초기 Figma URL */
	initialFigmaUrl: string;
}

type RightPanelTab = "figma" | "preview";

/**
 * 화면설계 상세 페이지 클라이언트 컴포넌트
 */
export const ScreenDesignClient = observer(
	({
		screenId,
		screen,
		initialMarkdown,
		initialFigmaUrl,
	}: ScreenDesignClientProps) => {
		const [markdown, setMarkdown] = useState(initialMarkdown);
		const [figmaUrl, setFigmaUrl] = useState(initialFigmaUrl);
		const [rightTab, setRightTab] = useState<RightPanelTab>("figma");
		const [isSaving, setIsSaving] = useState(false);
		const [hasChanges, setHasChanges] = useState(false);

		// 마크다운 변경 핸들러
		const handleMarkdownChange = (value: string) => {
			setMarkdown(value);
			setHasChanges(true);
		};

		// AI에서 마크다운 업데이트
		const handleAIUpdateMarkdown = (content: string) => {
			setMarkdown(content);
			setHasChanges(true);
		};

		// 저장 핸들러
		const handleSave = async () => {
			setIsSaving(true);
			try {
				await fetch(`/api/screens/${screenId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ markdown, figmaUrl }),
				});
				setHasChanges(false);
			} catch (error) {
				console.error("저장 실패:", error);
			} finally {
				setIsSaving(false);
			}
		};

		// 내보내기 핸들러
		const handleExport = () => {
			const blob = new Blob([markdown], { type: "text/markdown" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${screenId}.md`;
			a.click();
			URL.revokeObjectURL(url);
		};

		return (
			<div className="flex h-screen flex-col bg-background">
				{/* 헤더 */}
				<header className="flex items-center justify-between border-b border-divider px-4 py-3">
					<div className="flex items-center gap-3">
						<Link href={"/screens" as Route}>
							<Button variant="light" isIconOnly size="sm">
								<ArrowLeft className="size-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-lg font-semibold text-default-800">
								{screen.name}
							</h1>
							<p className="text-xs text-default-500">
								{screen.path} • {screen.description}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{hasChanges && (
							<span className="text-xs text-warning">저장되지 않은 변경</span>
						)}
						<Button
							size="sm"
							variant="flat"
							startContent={<Download className="size-4" />}
							onPress={handleExport}
						>
							내보내기
						</Button>
						<Button
							size="sm"
							color="primary"
							startContent={<Save className="size-4" />}
							onPress={handleSave}
							isLoading={isSaving}
							isDisabled={!hasChanges}
						>
							저장
						</Button>
					</div>
				</header>

				{/* 메인 콘텐츠 (Split View) */}
				<div className="flex flex-1 overflow-hidden">
					{/* 좌측: 마크다운 에디터 */}
					<div className="flex w-1/2 flex-col border-r border-divider">
						<div className="flex items-center gap-2 border-b border-divider bg-content2 px-3 py-2">
							<FileCode className="size-4 text-default-500" />
							<span className="text-sm font-medium text-default-700">
								화면 기획서
							</span>
						</div>
						<div className="flex-1 overflow-hidden">
							<MarkdownEditor
								value={markdown}
								onChange={handleMarkdownChange}
								placeholder={`# ${screen.name}\n\n## 기본 정보\n- 경로: ${screen.path}\n- 설명: ${screen.description}\n\n## 레이아웃\n\n## 컴포넌트\n\n## 인터랙션`}
							/>
						</div>
					</div>

					{/* 우측: Figma / 프리뷰 탭 */}
					<div className="flex w-1/2 flex-col">
						<div className="border-b border-divider bg-content2 px-3 py-2">
							<Tabs
								size="sm"
								variant="underlined"
								selectedKey={rightTab}
								onSelectionChange={(key) => setRightTab(key as RightPanelTab)}
								classNames={{
									tabList: "gap-4",
									tab: "px-0",
								}}
							>
								<Tab
									key="figma"
									title={
										<div className="flex items-center gap-1.5">
											<Figma className="size-4" />
											<span>Figma 디자인</span>
										</div>
									}
								/>
								<Tab
									key="preview"
									title={
										<div className="flex items-center gap-1.5">
											<Eye className="size-4" />
											<span>프리뷰</span>
										</div>
									}
								/>
							</Tabs>
						</div>
						<div className="flex-1 overflow-hidden">
							{rightTab === "figma" ? (
								<FigmaEmbed figmaUrl={figmaUrl} onUrlChange={setFigmaUrl} />
							) : (
								<MarkdownPreview content={markdown} />
							)}
						</div>
					</div>
				</div>

				{/* 하단: AI 채팅 */}
				<DesignChat
					screenId={screenId}
					screenName={screen.name}
					markdownContent={markdown}
					figmaUrl={figmaUrl}
					onUpdateMarkdown={handleAIUpdateMarkdown}
				/>
			</div>
		);
	},
);
