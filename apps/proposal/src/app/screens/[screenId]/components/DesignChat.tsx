"use client";

import { Button, ScrollShadow, Spinner, Textarea } from "@heroui/react";
import { Bot, ChevronDown, ChevronUp, Send, Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface DesignChatProps {
	/** 화면 ID */
	screenId: string;
	/** 화면 이름 */
	screenName: string;
	/** 현재 마크다운 내용 */
	markdownContent: string;
	/** Figma URL */
	figmaUrl: string;
	/** 마크다운 업데이트 핸들러 */
	onUpdateMarkdown: (content: string) => void;
}

/**
 * 화면 설계 AI 채팅 컴포넌트
 */
export const DesignChat = observer(
	({
		screenId,
		screenName,
		markdownContent,
		figmaUrl,
		onUpdateMarkdown,
	}: DesignChatProps) => {
		const [messages, setMessages] = useState<ChatMessage[]>([]);
		const [input, setInput] = useState("");
		const [isLoading, setIsLoading] = useState(false);
		const [isExpanded, setIsExpanded] = useState(true);
		const messagesEndRef = useRef<HTMLDivElement>(null);

		// 메시지 자동 스크롤
		useEffect(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}, [messages]);

		// AI 질의 핸들러
		const handleSubmit = async () => {
			if (!input.trim() || isLoading) return;

			const userMessage: ChatMessage = {
				role: "user",
				content: input.trim(),
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, userMessage]);
			setInput("");
			setIsLoading(true);

			try {
				const response = await fetch("/api/screens/ai", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						screenId,
						screenName,
						question: input.trim(),
						markdownContent,
						figmaUrl,
					}),
				});

				if (!response.ok) throw new Error("API 요청 실패");

				const data = await response.json();

				const assistantMessage: ChatMessage = {
					role: "assistant",
					content: data.answer,
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, assistantMessage]);

				// AI가 마크다운 업데이트를 제안한 경우
				if (data.suggestedMarkdown) {
					onUpdateMarkdown(data.suggestedMarkdown);
				}
			} catch (error) {
				const errorMessage: ChatMessage = {
					role: "assistant",
					content: `오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, errorMessage]);
			} finally {
				setIsLoading(false);
			}
		};

		// 키보드 핸들러
		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
			}
		};

		// 빠른 액션들
		const quickActions = [
			{
				label: "기획서 초안 생성",
				prompt: "이 화면의 기획서 초안을 마크다운으로 작성해줘",
			},
			{
				label: "컴포넌트 분석",
				prompt: "이 화면에 필요한 UI 컴포넌트를 분석해줘",
			},
			{
				label: "인터랙션 정의",
				prompt: "이 화면의 사용자 인터랙션을 정의해줘",
			},
			{
				label: "API 스펙 제안",
				prompt: "이 화면에 필요한 API 엔드포인트를 제안해줘",
			},
		];

		const handleQuickAction = (prompt: string) => {
			setInput(prompt);
		};

		return (
			<div className="flex flex-col border-t border-divider bg-content1">
				{/* 헤더 (토글) */}
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-content2"
				>
					<div className="flex items-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
							<Bot className="size-4 text-white" />
						</div>
						<span className="text-sm font-medium text-default-700">
							AI 어시스턴트
						</span>
						{messages.length > 0 && (
							<span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
								{messages.length}
							</span>
						)}
					</div>
					{isExpanded ? (
						<ChevronDown className="size-4 text-default-400" />
					) : (
						<ChevronUp className="size-4 text-default-400" />
					)}
				</button>

				{/* 채팅 본문 */}
				{isExpanded && (
					<div className="flex flex-col">
						{/* 빠른 액션 */}
						{messages.length === 0 && (
							<div className="flex flex-wrap gap-2 border-t border-divider px-4 py-3">
								{quickActions.map((action, index) => (
									<Button
										key={index}
										size="sm"
										variant="flat"
										startContent={<Sparkles className="size-3" />}
										onPress={() => handleQuickAction(action.prompt)}
										className="text-xs"
									>
										{action.label}
									</Button>
								))}
							</div>
						)}

						{/* 메시지 영역 */}
						{messages.length > 0 && (
							<ScrollShadow className="max-h-64 overflow-y-auto border-t border-divider p-4">
								<div className="space-y-3">
									{messages.map((message, index) => (
										<div
											key={index}
											className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
										>
											{message.role === "assistant" && (
												<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary">
													<Bot className="size-3 text-white" />
												</div>
											)}
											<div
												className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
													message.role === "user"
														? "bg-primary text-white"
														: "bg-content2 text-default-700"
												}`}
											>
												<p className="whitespace-pre-wrap">{message.content}</p>
											</div>
										</div>
									))}
									{isLoading && (
										<div className="flex items-center gap-2">
											<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary">
												<Bot className="size-3 text-white" />
											</div>
											<div className="flex items-center gap-2 rounded-lg bg-content2 px-3 py-2">
												<Spinner size="sm" />
												<span className="text-sm text-default-500">
													분석 중...
												</span>
											</div>
										</div>
									)}
									<div ref={messagesEndRef} />
								</div>
							</ScrollShadow>
						)}

						{/* 입력 영역 */}
						<div className="flex items-end gap-2 border-t border-divider p-3">
							<Textarea
								placeholder="화면 설계에 대해 질문하세요..."
								size="sm"
								minRows={1}
								maxRows={3}
								value={input}
								onValueChange={setInput}
								onKeyDown={handleKeyDown}
								disabled={isLoading}
								classNames={{
									inputWrapper: "bg-content2 min-h-10",
									input: "text-sm",
								}}
							/>
							<Button
								color="primary"
								isIconOnly
								isDisabled={!input.trim() || isLoading}
								onPress={handleSubmit}
								className="size-10 min-w-10 shrink-0"
							>
								<Send className="size-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	},
);
