"use client";

import { Send, Users } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import type { LiveViewerState } from "@/components/live-viewer/createLiveViewerState";
import { formatKoreanTime } from "@/lib/format";

const nicknameColorClasses = [
	"text-sky-300",
	"text-emerald-300",
	"text-violet-300",
	"text-rose-300",
	"text-amber-300",
	"text-cyan-300",
	"text-fuchsia-300",
	"text-lime-300",
];

function nicknameColorClass(nickname: string): string {
	let charSum = 0;
	for (const char of nickname) {
		charSum += char.codePointAt(0) ?? 0;
	}
	return nicknameColorClasses[charSum % nicknameColorClasses.length];
}

/**
 * 실시간 채팅 패널.
 * 실제 서비스에서는 메시지 push를 채팅 SDK 구독(IVS Chat Web SDK 또는 자체
 * WebSocket)으로 받고, 전송 시 채팅 REST/WebSocket API를 호출하도록 교체한다.
 */
export const ChatPanel = observer(function ChatPanel({
	state,
}: {
	state: LiveViewerState;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (scrollElement) {
			scrollElement.scrollTop = scrollElement.scrollHeight;
		}
	}, [state.chatMessages.length]);

	return (
		<div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
			<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
				<h2 className="font-display text-sm font-bold text-white">
					실시간 채팅
				</h2>
				<span className="flex items-center gap-1 text-xs text-zinc-400">
					<Users className="h-3.5 w-3.5" />
					{state.viewerCount.toLocaleString("ko-KR")}명
				</span>
			</div>

			<div
				ref={scrollRef}
				className="chat-scroll min-h-0 flex-1 space-y-1.5 overflow-y-auto px-3 py-3"
			>
				{state.chatMessages.map((message) => (
					<ChatRow key={message.id} state={state} message={message} />
				))}
			</div>

			<form
				className="flex items-center gap-2 border-t border-white/10 p-3"
				onSubmit={(event) => {
					event.preventDefault();
					state.sendChatMessage();
				}}
			>
				<input
					value={state.chatInput}
					onChange={(event) => state.setChatInput(event.target.value)}
					placeholder={
						state.me
							? "채팅을 입력해 보세요"
							: "로그인 후 채팅을 보낼 수 있어요"
					}
					maxLength={120}
					className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
				/>
				<button
					type="submit"
					disabled={!state.chatInput.trim()}
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 transition hover:bg-amber-400 disabled:opacity-40"
					aria-label="채팅 보내기"
				>
					<Send className="h-4 w-4" />
				</button>
			</form>
		</div>
	);
});

function ChatRow({
	state,
	message,
}: {
	state: LiveViewerState;
	message: LiveViewerState["chatMessages"][number];
}) {
	if (message.kind === "coupon" || message.kind === "system") {
		return (
			<div className="chat-in flex justify-center">
				<span className="rounded-full bg-violet-500/15 px-3 py-1 text-[11px] font-medium text-violet-300">
					{message.text}
				</span>
			</div>
		);
	}

	if (message.kind === "purchase") {
		return (
			<div className="chat-in">
				<span className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300">
					🛒 {message.text}
				</span>
			</div>
		);
	}

	const isMine = message.kind === "mine";
	const isMineButGuest = isMine && !state.me;

	return (
		<p className="chat-in px-1 text-[13px] leading-relaxed">
			<span className="mr-1.5 text-[10px] text-zinc-600">
				{formatKoreanTime(new Date(message.createdAt).toISOString())}
			</span>
			<span
				className={`font-semibold ${
					isMine ? "text-amber-300" : nicknameColorClass(message.nickname)
				}`}
			>
				{message.nickname}
				{isMine ? (isMineButGuest ? "" : " (나)") : ""}
			</span>{" "}
			<span className="text-zinc-200">{message.text}</span>
		</p>
	);
}
