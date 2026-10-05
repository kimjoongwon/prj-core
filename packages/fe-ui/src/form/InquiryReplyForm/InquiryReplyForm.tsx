"use client";

import { Tooltip } from "@heroui/react";
import { BookOpen, FileText, Paperclip, Send, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { Typography } from "../../data-display/Typography";
import { Separator } from "../../layout";
import { Button } from "../../input/Button/Button";
import { TextArea } from "../../input/TextArea/TextArea";
import { HStack, VStack } from "../../rhythm";

export interface Attachment {
	/** 파일 ID */
	id: string;
	/** 파일명 */
	name: string;
	/** 파일 크기 (bytes) */
	size: number;
	/** MIME 타입 */
	type: string;
	/** 파일 URL */
	url?: string;
}

export interface InquiryReplyFormProps {
	/** 폼 제출 핸들러 */
	onSubmit: (content: string, attachments?: File[]) => void;
	/** 지식베이스 검색 핸들러 */
	onSearchKnowledge?: () => void;
	/** 파일 첨부 핸들러 */
	onAttachFile?: (files: File[]) => void;
	/** 타이핑 시작 핸들러 */
	onTypingStart?: () => void;
	/** 타이핑 중지 핸들러 */
	onTypingStop?: () => void;
	/** 전송 중 여부 */
	isSending?: boolean;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 초안 내용 (외부에서 설정) */
	draftContent?: string;
	/** 첨부 파일 목록 */
	attachments?: Attachment[];
	/** 첨부 파일 제거 핸들러 */
	onRemoveAttachment?: (attachmentId: string) => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

const TYPING_DELAY = 500; // 타이핑 간주 지연 시간 (ms)

/**
 * InquiryReplyForm 컴포넌트
 * 답변 작성 폼으로 텍스트 영역, 지식베이스 참조, 파일 첨부, 전송 버튼을 포함합니다.
 *
 * @example
 * ```tsx
 * <InquiryReplyForm
 *   onSubmit={handleSubmit}
 *   onSearchKnowledge={handleSearchKnowledge}
 *   isSending={isSending}
 * />
 * ```
 */
export const InquiryReplyForm = observer(
	({
		onSubmit,
		onSearchKnowledge,
		onAttachFile,
		onTypingStart,
		onTypingStop,
		isSending = false,
		placeholder = "답변을 입력하세요...",
		draftContent,
		attachments,
		onRemoveAttachment,
		className = "",
	}: InquiryReplyFormProps) => {
		const [content, setContent] = useState(draftContent ?? "");
		const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
		const fileInputRef = useRef<HTMLInputElement>(null);
		const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

		// 초안 내용이 변경되면 반영
		const currentContent = draftContent ?? content;

		const handleContentChange = (value: string) => {
			setContent(value);

			// 타이핑 상태 관리
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			onTypingStart?.();

			typingTimeoutRef.current = setTimeout(() => {
				onTypingStop?.();
			}, TYPING_DELAY);
		};

		const handleSubmit = () => {
			if (!currentContent.trim() && selectedFiles.length === 0) return;

			onSubmit(
				currentContent,
				selectedFiles.length > 0 ? selectedFiles : undefined,
			);
			setContent("");
			setSelectedFiles([]);

			// 타이핑 상태 초기화
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			onTypingStop?.();
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			// Ctrl/Cmd + Enter로 전송
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				e.preventDefault();
				handleSubmit();
			}
		};

		const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files ?? []);
			if (files.length > 0) {
				setSelectedFiles((prev) => [...prev, ...files]);
				onAttachFile?.(files);
			}
			// input 초기화
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		};

		const handleRemoveFile = (index: number) => {
			setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
		};

		const handleRemoveAttachment = (attachmentId: string) => {
			onRemoveAttachment?.(attachmentId);
		};

		const formatFileSize = (bytes: number): string => {
			if (bytes < 1024) return `${bytes}B`;
			if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
			return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
		};

		const canSubmit =
			currentContent.trim().length > 0 || selectedFiles.length > 0;
		const isLoading = isSending;

		return (
			<VStack gap="block" className={className}>
				{/* 텍스트 영역 */}
				<TextArea
					placeholder={placeholder}
					value={currentContent}
					onValueChange={handleContentChange}
					onKeyDown={handleKeyDown}
					isDisabled={isLoading}
					minRows={3}
					maxRows={8}
					classNames={{
						input: "resize-none",
					}}
				/>

				{/* 첨부 파일 목록 */}
				{(selectedFiles.length > 0 ||
					(attachments && attachments.length > 0)) && (
					<HStack className="flex-wrap">
						{/* 새로 선택한 파일 */}
						{selectedFiles.map((file, index) => (
							<HStack
								key={`new-${index}`}
								alignItems="center"
								gap="dense"
								className="rounded-lg bg-surface-secondary px-2 py-1"
							>
								<FileText className="size-4 text-muted" />
								<Typography type="body-xs">{file.name}</Typography>
								<Typography type="body-xs" color="muted">
									({formatFileSize(file.size)})
								</Typography>
								<Button
									isIconOnly
									size="sm"
									variant="ghost"
									onClick={() => handleRemoveFile(index)}
									className="h-5 w-5 min-w-5"
								>
									<X className="size-3" />
								</Button>
							</HStack>
						))}

						{/* 기존 첨부 파일 */}
						{attachments?.map((attachment) => (
							<HStack
								key={attachment.id}
								alignItems="center"
								gap="dense"
								className="rounded-lg bg-surface-secondary px-2 py-1"
							>
								<FileText className="size-4 text-muted" />
								<Typography type="body-xs">{attachment.name}</Typography>
								<Typography type="body-xs" color="muted">
									({formatFileSize(attachment.size)})
								</Typography>
								{onRemoveAttachment && (
									<Button
										isIconOnly
										size="sm"
										variant="ghost"
										onClick={() => handleRemoveAttachment(attachment.id)}
										className="h-5 w-5 min-w-5"
									>
										<X className="size-3" />
									</Button>
								)}
							</HStack>
						))}
					</HStack>
				)}

				<Separator />

				{/* 액션 버튼 */}
				<div className="flex items-center justify-between">
					{/* 왼쪽: 보조 기능 */}
					<HStack alignItems="center">
						{/* 파일 첨부 */}
						<input
							ref={fileInputRef}
							type="file"
							multiple
							onChange={handleFileSelect}
							className="hidden"
						/>
						<Tooltip>
							<Tooltip.Trigger>
								<Button
									isIconOnly
									size="sm"
									variant="tertiary"
									onClick={() => fileInputRef.current?.click()}
									isDisabled={isLoading}
								>
									<Paperclip className="size-4" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>파일 첨부</Tooltip.Content>
						</Tooltip>

						{/* 지식베이스 검색 */}
						{onSearchKnowledge && (
							<Tooltip>
								<Tooltip.Trigger>
									<Button
										size="sm"
										variant="tertiary"
										startContent={<BookOpen className="size-4" />}
										onClick={onSearchKnowledge}
										isDisabled={isLoading}
									>
										지식베이스
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>지식베이스 검색</Tooltip.Content>
							</Tooltip>
						)}
					</HStack>

					{/* 오른쪽: 전송 버튼 */}
					<Tooltip>
						<Tooltip.Trigger>
							<Button
								size="sm"
								variant="primary"
								startContent={<Send className="size-4" />}
								onClick={handleSubmit}
								isDisabled={!canSubmit || isLoading}
								isLoading={isSending}
							>
								전송
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>Ctrl+Enter로 전송</Tooltip.Content>
					</Tooltip>
				</div>

				{/* 힌트 */}
				<Typography type="body-xs" color="muted">
					Ctrl + Enter로 빠르게 전송할 수 있습니다
				</Typography>
			</VStack>
		);
	},
);

InquiryReplyForm.displayName = "InquiryReplyForm";
