"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button, Link } from "../../design-system/primitives";
import { useT } from "../../i18n";

export interface RowActionsCellProps {
	/** 아이템 ID */
	id: string;
	/** 기본 경로 (예: "/users") */
	basePath: string;
	/** 상세 보기 표시 여부 */
	showView?: boolean;
	/** 수정 버튼 표시 여부 */
	showEdit?: boolean;
	/** 삭제 버튼 표시 여부 */
	showDelete?: boolean;
	/** 수정 버튼 비활성화 */
	disableEdit?: boolean;
	/** 삭제 버튼 비활성화 */
	disableDelete?: boolean;
	/** 삭제 버튼 클릭 핸들러 */
	onDelete?: () => void;
}

/**
 * 행 액션 버튼들을 표시하는 Cell 컴포넌트
 */
export const RowActionsCell = observer(function RowActionsCell({
	id,
	basePath,
	showView = true,
	showEdit = true,
	showDelete = true,
	disableEdit = false,
	disableDelete = false,
	onDelete,
}: RowActionsCellProps) {
	const t = useT();

	return (
		<div className="flex justify-center gap-1">
			{showView && (
				<Button
					as={Link}
					href={`${basePath}/${id}`}
					size="sm"
					variant="light"
					isIconOnly
					aria-label={t("상세 보기")}
				>
					<Eye className="h-4 w-4" />
				</Button>
			)}
			{showEdit && (
				<Button
					as={Link}
					href={`${basePath}/${id}/edit`}
					size="sm"
					variant="light"
					isIconOnly
					isDisabled={disableEdit}
					aria-label={t("수정")}
				>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{showDelete && (
				<Button
					size="sm"
					variant="light"
					color="danger"
					isIconOnly
					isDisabled={disableDelete}
					onPress={onDelete}
					aria-label={t("삭제")}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
});
