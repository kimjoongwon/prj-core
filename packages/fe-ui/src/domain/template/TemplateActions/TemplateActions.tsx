"use client";

import { Eye, Pencil, Send, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../../input/Button/Button";

export interface TemplateActionsProps {
	/** 템플릿 ID */
	templateId: string;
	/** 활성 상태 */
	isActive: boolean;
	/** 수정 페이지 이동 핸들러 */
	onEdit: () => void;
	/** 삭제 핸들러 */
	onDelete: () => void;
	/** 활성/비활성 토글 핸들러 */
	onToggle: () => void;
	/** 미리보기 모달 열기 핸들러 */
	onPreview: () => void;
	/** 발송 테스트 모달 열기 핸들러 */
	onSendTest: () => void;
}

/**
 * TemplateActions domain 컴포넌트
 *
 * 메시지 템플릿 상세 화면의 페이지 헤더 actions 영역에 렌더링되는 액션 버튼 그룹입니다.
 * 미리보기, 테스트 발송, 수정, 삭제 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <TemplateActions
 *   templateId="template-1"
 *   isActive={true}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onToggle={handleToggle}
 *   onPreview={handlePreview}
 *   onSendTest={handleSendTest}
 * />
 * ```
 */
export const TemplateActions = observer(
	({
		templateId: _templateId,
		isActive: _isActive,
		onEdit,
		onDelete,
		onToggle: _onToggle,
		onPreview,
		onSendTest,
	}: TemplateActionsProps) => {
		return (
			<div className="flex gap-2 items-center">
				{/* 미리보기 */}
				<Button
					size="sm"
					variant="tertiary"
					startContent={<Eye size={16} />}
					onPress={onPreview}
				>
					미리보기
				</Button>

				{/* 테스트 발송 */}
				<Button
					size="sm"
					variant="tertiary"
					startContent={<Send size={16} />}
					onPress={onSendTest}
				>
					테스트 발송
				</Button>

				{/* 수정 */}
				<Button
					size="sm"
					variant="tertiary"
					startContent={<Pencil size={16} />}
					onPress={onEdit}
				>
					수정
				</Button>

				{/* 삭제 */}
				<Button
					size="sm"
					variant="tertiary"
					startContent={<Trash2 size={16} />}
					onPress={onDelete}
				>
					삭제
				</Button>
			</div>
		);
	},
);

TemplateActions.displayName = "TemplateActions";
