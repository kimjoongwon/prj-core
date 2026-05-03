"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Ban } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button } from "../../control/Button/Button";
import { useT } from "../../i18n";

interface RevokeButtonCellProps {
	/** 폐기 확인 후 호출되는 콜백 */
	onRevoke: () => void;
	/** 폐기 진행 중 여부 */
	isLoading?: boolean;
	/** 확인 메시지 */
	confirmMessage?: string;
}

/**
 * 폐기 버튼 + 확인 팝오버를 표시하는 Cell 컴포넌트
 */
export const RevokeButtonCell = observer(function RevokeButtonCell({
	onRevoke,
	isLoading = false,
	confirmMessage = "이 세션/토큰을 폐기하시겠습니까?",
}: RevokeButtonCellProps) {
	const t = useT();
	const [isOpen, setIsOpen] = useState(false);

	const handleConfirm = () => {
		onRevoke();
		setIsOpen(false);
	};

	return (
		<Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="left">
			<PopoverTrigger>
				<Button
					size="sm"
					color="danger"
					variant="flat"
					startContent={<Ban className="h-3 w-3" />}
					isLoading={isLoading}
				>
					폐기
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="space-y-3 p-2">
					<p className="text-sm">{t(confirmMessage)}</p>
					<div className="flex justify-end gap-2">
						<Button size="sm" variant="flat" onPress={() => setIsOpen(false)}>
							취소
						</Button>
						<Button
							size="sm"
							color="danger"
							onPress={handleConfirm}
							isLoading={isLoading}
						>
							폐기
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
});
