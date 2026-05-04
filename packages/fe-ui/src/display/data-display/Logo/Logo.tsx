import { cn } from "@cocrepo/ui/heroui";
import { Button } from "../../../control/Button/Button";
import { HStack } from "../../../rhythm/HStack/HStack";

export interface LogoProps {
	/** 클릭 핸들러 (보통 홈으로 이동) */
	onClick?: () => void;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 커스텀 로고 콘텐츠 (미사용) */
	children?: React.ReactNode;
}

/**
 * Logo 컴포넌트
 * 앱 로고를 표시하는 버튼입니다.
 *
 * @example
 * ```tsx
 * <Logo onClick={() => router.push("/")} />
 *
 * // 커스텀 스타일
 * <Logo className="text-primary" onClick={handleLogoClick} />
 * ```
 */
export const Logo = (props: LogoProps) => {
	const { className, onClick } = props;

	return (
		<HStack className="items-center">
			<Button
				variant="light"
				className={cn(className, "p-0 font-bold text-2xl")}
				onPress={onClick}
			>
				오노라
			</Button>
		</HStack>
	);
};
