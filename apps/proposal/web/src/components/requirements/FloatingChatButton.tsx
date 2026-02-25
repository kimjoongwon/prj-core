"use client";

import { Button, Tooltip } from "@heroui/react";
import { MessageCircle, Sparkles } from "lucide-react";
import { observer } from "mobx-react-lite";

interface FloatingChatButtonProps {
	/** 클릭 핸들러 */
	onPress: () => void;
	/** 읽지 않은 메시지 수 (옵션) */
	unreadCount?: number;
}

/**
 * 플로팅 채팅 버튼 (FAB 스타일)
 */
export const FloatingChatButton = observer(
	({ onPress, unreadCount = 0 }: FloatingChatButtonProps) => {
		return (
			<div className="fixed bottom-5 right-5 z-40">
				<Tooltip content="AI에게 질문하기" placement="left">
					<Button
						onPress={onPress}
						className="group relative size-14 min-w-0 rounded-full bg-gradient-to-br from-primary to-secondary p-0 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
					>
						{/* 아이콘 */}
						<div className="relative">
							<MessageCircle className="size-6 text-white transition-transform group-hover:scale-110" />
							<Sparkles className="absolute -right-1 -top-1 size-3 text-yellow-300 opacity-0 transition-opacity group-hover:opacity-100" />
						</div>

						{/* 뱃지 */}
						{unreadCount > 0 && (
							<span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">
								{unreadCount > 9 ? "9+" : unreadCount}
							</span>
						)}

						{/* 펄스 애니메이션 */}
						<span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />
					</Button>
				</Tooltip>

				{/* 키보드 단축키 힌트 */}
				<div className="mt-2 text-center">
					<span className="rounded bg-content2 px-1.5 py-0.5 text-xs text-default-500">
						⌘K
					</span>
				</div>
			</div>
		);
	},
);
