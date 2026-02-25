"use client";

import { Button, ScrollShadow, Spinner, Textarea } from "@heroui/react";
import {
	Bot,
	Maximize2,
	Minimize2,
	Minus,
	Send,
	Trash2,
	X,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import type { AIMessage, RequirementGraph } from "./types";

interface FloatingChatPanelProps {
	/** 패널 열림 상태 */
	isOpen: boolean;
	/** 패널 닫기 핸들러 */
	onClose: () => void;
	/** 그래프 데이터 (컨텍스트용, 없으면 범용 AI 모드) */
	graph?: RequirementGraph;
	/** AI 질의 함수 */
	onQuery: (question: string) => Promise<string>;
}

type PanelSize = "minimized" | "normal" | "maximized";

/**
 * 플로팅 AI 채팅 패널 (Claude/ChatGPT 스타일)
 */
export const FloatingChatPanel = observer(
	({ isOpen, onClose, graph, onQuery }: FloatingChatPanelProps) => {
		const [messages, setMessages] = useState<AIMessage[]>([]);
		const [input, setInput] = useState("");
		const [isLoading, setIsLoading] = useState(false);
		const [panelSize, setPanelSize] = useState<PanelSize>("normal");
		const [panelHeight, setPanelHeight] = useState(500);
		const messagesEndRef = useRef<HTMLDivElement>(null);
		const resizeRef = useRef<HTMLDivElement>(null);
		const isResizing = useRef(false);

		// 메시지 자동 스크롤
		useEffect(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}, [messages]);

		// 리사이즈 핸들러
		useEffect(() => {
			const handleMouseMove = (e: MouseEvent) => {
				if (!isResizing.current) return;
				const newHeight = window.innerHeight - e.clientY - 20;
				setPanelHeight(
					Math.max(300, Math.min(newHeight, window.innerHeight - 100)),
				);
			};

			const handleMouseUp = () => {
				isResizing.current = false;
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}, []);

		const handleResizeStart = () => {
			isResizing.current = true;
			document.body.style.cursor = "ns-resize";
			document.body.style.userSelect = "none";
		};

		// 질문 전송 핸들러
		const handleSubmit = async () => {
			if (!input.trim() || isLoading) return;

			const userMessage: AIMessage = {
				role: "user",
				content: input.trim(),
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, userMessage]);
			setInput("");
			setIsLoading(true);

			try {
				const response = await onQuery(input.trim());

				const assistantMessage: AIMessage = {
					role: "assistant",
					content: response,
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, assistantMessage]);
			} catch (error) {
				const errorMessage: AIMessage = {
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

		// 대화 초기화
		const handleClear = () => {
			setMessages([]);
		};

		// 패널 크기 토글
		const toggleSize = () => {
			if (panelSize === "maximized") {
				setPanelSize("normal");
			} else {
				setPanelSize("maximized");
			}
		};

		const toggleMinimize = () => {
			if (panelSize === "minimized") {
				setPanelSize("normal");
			} else {
				setPanelSize("minimized");
			}
		};

		// 예시 질문들 (graph 여부에 따라 다르게)
		const exampleQuestions = graph
			? [
					"User 엔티티 수정 시 영향받는 화면은?",
					"회원 목록 화면이 호출하는 API는?",
					"회원 등록 기능의 테스트 케이스는?",
					"이 프로젝트의 전체 구조를 설명해줘",
				]
			: [
					"이 프로젝트의 기술 스택을 알려줘",
					"화면 설계 시 고려할 점은?",
					"API 설계 규칙을 설명해줘",
					"DB 스키마 설계 방법은?",
				];

		if (!isOpen) return null;

		// 패널 크기별 스타일
		const getPanelStyle = () => {
			if (panelSize === "maximized") {
				return {
					width: "calc(100vw - 40px)",
					height: "calc(100vh - 100px)",
					right: "20px",
					bottom: "20px",
				};
			}
			if (panelSize === "minimized") {
				return {
					width: "380px",
					height: "56px",
					right: "20px",
					bottom: "20px",
				};
			}
			return {
				width: "420px",
				height: `${panelHeight}px`,
				right: "20px",
				bottom: "20px",
			};
		};

		return (
			<div
				className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-divider bg-content1 shadow-2xl transition-all duration-300"
				style={getPanelStyle()}
			>
				{/* 리사이즈 핸들 (normal 모드에서만) */}
				{panelSize === "normal" && (
					<div
						ref={resizeRef}
						onMouseDown={handleResizeStart}
						aria-hidden="true"
						className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize hover:bg-primary/20"
					/>
				)}

				{/* 헤더 */}
				<div className="flex items-center justify-between border-b border-divider bg-content2 px-4 py-3">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
							<Bot className="size-4 text-white" />
						</div>
						<div>
							<h3 className="text-sm font-semibold text-default-800">
								AI 어시스턴트
							</h3>
							{panelSize !== "minimized" && (
								<p className="text-xs text-default-500">
									{graph
										? `${graph.name} • ${graph.nodes.length}개 노드`
										: "무엇이든 물어보세요"}
								</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-1">
						{messages.length > 0 && panelSize !== "minimized" && (
							<Button
								size="sm"
								variant="light"
								isIconOnly
								onPress={handleClear}
								className="text-default-500 hover:text-danger"
							>
								<Trash2 className="size-4" />
							</Button>
						)}
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={toggleMinimize}
							className="text-default-500"
						>
							<Minus className="size-4" />
						</Button>
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={toggleSize}
							className="text-default-500"
						>
							{panelSize === "maximized" ? (
								<Minimize2 className="size-4" />
							) : (
								<Maximize2 className="size-4" />
							)}
						</Button>
						<Button
							size="sm"
							variant="light"
							isIconOnly
							onPress={onClose}
							className="text-default-500 hover:text-danger"
						>
							<X className="size-4" />
						</Button>
					</div>
				</div>

				{/* 본문 (minimized가 아닐 때만) */}
				{panelSize !== "minimized" && (
					<>
						{/* 메시지 영역 */}
						<ScrollShadow className="flex-1 overflow-y-auto p-4">
							{messages.length === 0 ? (
								<div className="flex h-full flex-col">
									<div className="mb-6 text-center">
										<div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
											<Bot className="size-6 text-primary" />
										</div>
										<h4 className="mb-1 font-medium text-default-700">
											무엇이든 물어보세요
										</h4>
										<p className="text-sm text-default-500">
											요구사항 그래프에 대해 질문하면 분석해드립니다
										</p>
									</div>

									<div className="space-y-2">
										<p className="text-xs font-medium text-default-500">
											추천 질문
										</p>
										{exampleQuestions.map((question, index) => (
											<button
												key={index}
												type="button"
												onClick={() => setInput(question)}
												className="block w-full rounded-lg border border-divider bg-content2 p-3 text-left text-sm text-default-700 transition-all hover:border-primary hover:bg-content3"
											>
												{question}
											</button>
										))}
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{messages.map((message, index) => (
										<MessageBubble key={index} message={message} />
									))}
									{isLoading && (
										<div className="flex items-start gap-3">
											<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
												<Bot className="size-4 text-white" />
											</div>
											<div className="flex items-center gap-2 rounded-lg bg-content2 px-4 py-3">
												<Spinner size="sm" />
												<span className="text-sm text-default-500">
													분석 중...
												</span>
											</div>
										</div>
									)}
									<div ref={messagesEndRef} />
								</div>
							)}
						</ScrollShadow>

						{/* 입력 영역 */}
						<div className="border-t border-divider bg-content2 p-4">
							<div className="flex items-end gap-2">
								<Textarea
									placeholder="질문을 입력하세요... (Shift+Enter로 줄바꿈)"
									size="sm"
									minRows={1}
									maxRows={4}
									value={input}
									onValueChange={setInput}
									onKeyDown={handleKeyDown}
									disabled={isLoading}
									classNames={{
										inputWrapper: "bg-content1 border-divider min-h-10",
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
							<p className="mt-2 text-xs text-default-400">
								Enter로 전송 • Shift+Enter로 줄바꿈
							</p>
						</div>
					</>
				)}
			</div>
		);
	},
);

/**
 * 메시지 버블 컴포넌트
 */
interface MessageBubbleProps {
	message: AIMessage;
}

const MessageBubble = observer(({ message }: MessageBubbleProps) => {
	const isUser = message.role === "user";

	if (isUser) {
		return (
			<div className="flex justify-end">
				<div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-white">
					<p className="whitespace-pre-wrap text-sm">{message.content}</p>
					<p className="mt-1 text-right text-xs text-primary-200">
						{message.timestamp.toLocaleTimeString("ko-KR", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start gap-3">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
				<Bot className="size-4 text-white" />
			</div>
			<div className="max-w-[85%] rounded-2xl rounded-tl-md bg-content2 px-4 py-3">
				<p className="whitespace-pre-wrap text-sm text-default-800">
					{message.content}
				</p>
				<p className="mt-1 text-xs text-default-400">
					{message.timestamp.toLocaleTimeString("ko-KR", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
			</div>
		</div>
	);
});
