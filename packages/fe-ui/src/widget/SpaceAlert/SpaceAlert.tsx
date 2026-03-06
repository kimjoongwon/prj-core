"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
import { Text } from "../../primitive/data-display/Text/Text";

export interface SpaceAlertProps {
	/** Alert 제목 */
	title?: string;
	/** Alert 메시지 */
	message?: string;
	/** 확인 버튼 텍스트 */
	confirmText?: string;
	/** 확인 버튼 클릭 핸들러 */
	onConfirm?: () => void;
	/** 닫기 버튼 클릭 핸들러 (옵셔널) */
	onDismiss?: () => void;
}

/**
 * SpaceAlert 컴포넌트
 * Space가 선택되지 않았을 때 표시되는 모달 Alert입니다.
 *
 * @example
 * ```tsx
 * <SpaceAlert
 *   title="Space 선택 필요"
 *   message="서비스 이용을 위해 Space를 선택해주세요."
 *   confirmText="Space 선택하기"
 *   onConfirm={handleSelectSpace}
 *   onDismiss={handleDismiss}
 * />
 * ```
 */
export const SpaceAlert = observer(function SpaceAlert({
	title = "Space 선택 필요",
	message = "서비스 이용을 위해 Space를 선택해주세요.",
	confirmText = "Space 선택하기",
	onConfirm,
	onDismiss,
}: SpaceAlertProps) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
			<div className="bg-white rounded-xl shadow-xl max-w-[400px] w-[90%]">
				<div className="flex flex-col items-center gap-4 p-8">
					{/* 경고 아이콘 */}
					<div className="text-warning">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
					</div>

					<Text variant="h4" className="text-center font-bold">
						{title}
					</Text>

					<Text variant="body1" className="text-center text-default-600">
						{message}
					</Text>

					<div className="flex gap-3 mt-2">
						{onDismiss && (
							<Button variant="bordered" onPress={onDismiss}>
								닫기
							</Button>
						)}
						<Button color="primary" onPress={onConfirm}>
							{confirmText}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
});
