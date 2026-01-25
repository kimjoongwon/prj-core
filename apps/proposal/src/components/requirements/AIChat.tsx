"use client";

import { Button, ScrollShadow, Spinner, Textarea } from "@heroui/react";
import { Bot, Send, Trash2, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import type { AIMessage, RequirementGraph } from "./types";

interface AIChatProps {
	/** 그래프 데이터 (컨텍스트용) */
	graph: RequirementGraph;
	/** AI 질의 함수 */
	onQuery: (question: string) => Promise<string>;
}

/**
 * AI 질의 채팅 인터페이스
 */
export const AIChat = observer(({ graph, onQuery }: AIChatProps) => {
	const [messages, setMessages] = useState<AIMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

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

	// 예시 질문들
	const exampleQuestions = [
		"User 엔티티 수정 시 영향받는 화면은?",
		"회원 목록 화면이 호출하는 API는?",
		"회원 등록 기능의 테스트 케이스는?",
	];

	return (
		<div className="flex h-full flex-col gap-3">
			{/* 헤더 */}
			<div className="flex items-center justify-between">
				<h3 className="flex items-center gap-2 text-sm font-semibold text-default-700">
					<Bot className="size-4 text-primary" />
					AI에게 질문
				</h3>
				{messages.length > 0 && (
					<Button
						size="sm"
						variant="light"
						color="danger"
						isIconOnly
						onPress={handleClear}
					>
						<Trash2 className="size-4" />
					</Button>
				)}
			</div>

			{/* 프로젝트 정보 */}
			<div className="rounded-md bg-content2 p-2 text-xs text-default-500">
				<span className="font-medium">프로젝트:</span> {graph.name}
				<span className="mx-2">|</span>
				<span className="font-medium">노드:</span> {graph.nodes.length}개
				<span className="mx-2">|</span>
				<span className="font-medium">엣지:</span> {graph.edges.length}개
			</div>

			{/* 메시지 영역 */}
			<ScrollShadow className="flex-1 overflow-y-auto">
				{messages.length === 0 ? (
					<div className="space-y-2">
						<p className="text-xs text-default-400">예시 질문:</p>
						{exampleQuestions.map((question, index) => (
							<button
								key={index}
								type="button"
								onClick={() => setInput(question)}
								className="block w-full rounded-md bg-content2 p-2 text-left text-xs text-default-600 transition-colors hover:bg-content3"
							>
								"{question}"
							</button>
						))}
					</div>
				) : (
					<div className="space-y-3">
						{messages.map((message, index) => (
							<MessageBubble key={index} message={message} />
						))}
						{isLoading && (
							<div className="flex items-center gap-2 text-sm text-default-400">
								<Spinner size="sm" />
								<span>생각 중...</span>
							</div>
						)}
					</div>
				)}
			</ScrollShadow>

			{/* 입력 영역 */}
			<div className="flex gap-2">
				<Textarea
					placeholder="그래프에 대해 질문하세요..."
					size="sm"
					minRows={1}
					maxRows={3}
					value={input}
					onValueChange={setInput}
					onKeyDown={handleKeyDown}
					disabled={isLoading}
					classNames={{
						input: "bg-content2",
					}}
				/>
				<Button
					size="sm"
					color="primary"
					isIconOnly
					isDisabled={!input.trim() || isLoading}
					onPress={handleSubmit}
				>
					<Send className="size-4" />
				</Button>
			</div>
		</div>
	);
});

/**
 * 메시지 버블 컴포넌트
 */
interface MessageBubbleProps {
	message: AIMessage;
}

const MessageBubble = observer(({ message }: MessageBubbleProps) => {
	const isUser = message.role === "user";

	return (
		<div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
			{!isUser && (
				<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary">
					<Bot className="size-3 text-white" />
				</div>
			)}
			<div
				className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
					isUser ? "bg-primary text-white" : "bg-content2 text-default-800"
				}`}
			>
				<p className="whitespace-pre-wrap">{message.content}</p>
				<p
					className={`mt-1 text-xs ${isUser ? "text-primary-200" : "text-default-400"}`}
				>
					{message.timestamp.toLocaleTimeString("ko-KR", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
			</div>
			{isUser && (
				<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-default-200">
					<User className="size-3 text-default-600" />
				</div>
			)}
		</div>
	);
});
