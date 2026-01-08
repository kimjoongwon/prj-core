"use client";

import { Button } from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface MemberDetailHeaderProps {
	memberName: string;
	onClickBack: () => void;
	onClickEdit: () => void;
	onClickDelete: () => void;
}

/**
 * 회원 상세 페이지 헤더
 */
export function MemberDetailHeader({
	memberName,
	onClickBack,
	onClickEdit,
	onClickDelete,
}: MemberDetailHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-4">
				<Button
					isIconOnly
					variant="light"
					size="sm"
					onPress={onClickBack}
					aria-label="목록으로 돌아가기"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div className="flex flex-col gap-1">
					<span className="text-2xl font-bold">{memberName}</span>
					<span className="text-default-500">회원 상세 정보</span>
				</div>
			</div>
			<div className="flex gap-2">
				<Button
					variant="flat"
					startContent={<Edit className="h-4 w-4" />}
					onPress={onClickEdit}
				>
					<span>수정</span>
				</Button>
				<Button
					variant="flat"
					color="danger"
					startContent={<Trash2 className="h-4 w-4" />}
					onPress={onClickDelete}
				>
					<span>삭제</span>
				</Button>
			</div>
		</div>
	);
}
