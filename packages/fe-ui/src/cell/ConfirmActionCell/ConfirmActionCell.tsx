"use client";

import { Popover } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { ButtonProps } from "../../action/Button/Button";
import { Button } from "../../action/Button/Button";
import { useT } from "../../i18n";

export interface ConfirmActionCellProps
	extends Omit<ButtonProps, "onPress" | "isLoading"> {
	/** 확인 후 실행할 액션 */
	onConfirm: () => void | Promise<void>;
	/** 확인 메시지 */
	confirmMessage: string;
	/** 확인 버튼 라벨 */
	confirmLabel?: string;
	/** 취소 버튼 라벨 */
	cancelLabel?: string;
	/** 액션 진행 중 여부 */
	isLoading?: boolean;
	/** 셀 안 정렬 */
	align?: "center" | "start" | "end";
}

const ALIGN_CLASS_NAME: Record<
	NonNullable<ConfirmActionCellProps["align"]>,
	string
> = {
	center: "justify-center",
	start: "justify-start",
	end: "justify-end",
};

/**
 * 확인 팝오버가 필요한 테이블 액션 버튼 셀
 */
export const ConfirmActionCell = observer(function ConfirmActionCell({
	onConfirm,
	confirmMessage,
	confirmLabel,
	cancelLabel = "취소",
	isLoading = false,
	align = "center",
	size = "sm",
	children,
	...buttonProps
}: ConfirmActionCellProps) {
	const t = useT();
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const pending = isLoading || isConfirming;
	const actionLabel = confirmLabel ?? children;

	const handleConfirm = async () => {
		if (pending) return;

		setIsConfirming(true);
		try {
			await onConfirm();
			setIsOpen(false);
		} finally {
			setIsConfirming(false);
		}
	};

	return (
		<div className={`flex w-full ${ALIGN_CLASS_NAME[align]}`}>
			<Popover isOpen={isOpen} onOpenChange={setIsOpen}>
				<Popover.Trigger>
					<Button size={size} isLoading={pending} {...buttonProps}>
						{children}
					</Button>
				</Popover.Trigger>
				<Popover.Content placement="left">
					<div className="space-y-3 p-2">
						<p className="text-sm">{t(confirmMessage)}</p>
						<div className="flex justify-end gap-2">
							<Button size="sm" variant="flat" onPress={() => setIsOpen(false)}>
								{cancelLabel}
							</Button>
							<Button
								size="sm"
								color={buttonProps.color}
								onPress={handleConfirm}
								isLoading={pending}
							>
								{actionLabel}
							</Button>
						</div>
					</div>
				</Popover.Content>
			</Popover>
		</div>
	);
});
