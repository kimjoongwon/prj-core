import { Button } from "../../control/Button/Button";
import { Card } from "@heroui/react";

export interface UnsavedChangesIndicatorProps {
	/** 표시 여부 */
	visible: boolean;
	/** 저장 중 여부 */
	isSaving?: boolean;
	/** 저장 클릭 핸들러 */
	onSave: () => void;
	/** 초기화 클릭 핸들러 */
	onReset: () => void;
}

/**
 * UnsavedChangesIndicator Widget 컴포넌트
 * 저장되지 않은 변경사항이 있을 때 화면 하단에 표시되는 알림 바입니다.
 *
 * @example
 * ```tsx
 * <UnsavedChangesIndicator
 *   visible={hasChanges}
 *   isSaving={isSaving}
 *   onSave={handleSave}
 *   onReset={handleReset}
 * />
 * ```
 */
export const UnsavedChangesIndicator = ({
	visible,
	isSaving = false,
	onSave,
	onReset,
}: UnsavedChangesIndicatorProps) => {
	if (!visible) return null;

	return (
		<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
			<Card className="border border-accent bg-accent-soft shadow-lg">
				<Card.Content className="flex flex-row items-center gap-4 px-4 py-3">
					<span className="text-accent">
						저장되지 않은 변경사항이 있습니다
					</span>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="flat"
							onPress={onReset}
							isDisabled={isSaving}
						>
							<span>초기화</span>
						</Button>
						<Button
							size="sm"
							color="primary"
							onPress={onSave}
							isDisabled={isSaving}
						>
							<span>{isSaving ? "저장 중..." : "저장"}</span>
						</Button>
					</div>
				</Card.Content>
			</Card>
		</div>
	);
};

UnsavedChangesIndicator.displayName = "UnsavedChangesIndicator";
