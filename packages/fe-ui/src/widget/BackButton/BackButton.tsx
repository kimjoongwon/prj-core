import { Button } from "@cocrepo/ui/heroui";
import { ChevronLeft } from "lucide-react";

export interface BackButtonProps {
	/** 뒤로가기 클릭 핸들러 */
	onClick: () => void;
	/** 버튼 레이블 (기본값: "뒤로") */
	label?: string;
	/** 아이콘만 표시 여부 */
	iconOnly?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * BackButton Widget 컴포넌트
 * 모바일 서브메뉴 화면에서 뒤로가기 버튼으로 사용됩니다.
 *
 * @example
 * ```tsx
 * <BackButton onClick={handleBack} />
 * <BackButton onClick={handleBack} iconOnly />
 * ```
 */
export const BackButton = ({
	onClick,
	label = "뒤로",
	iconOnly = false,
	className,
}: BackButtonProps) => {
	return (
		<Button
			variant="light"
			onPress={onClick}
			className={className}
			startContent={<ChevronLeft className="h-5 w-5" size={20} />}
			isIconOnly={iconOnly}
		>
			{!iconOnly && label}
		</Button>
	);
};

BackButton.displayName = "BackButton";
