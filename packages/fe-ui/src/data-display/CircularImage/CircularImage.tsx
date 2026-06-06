import { cn } from "@heroui/react";

export interface CircularImageProps {
	/** 이미지 소스 URL */
	src: string;
	/** 대체 텍스트 */
	alt: string;
	/** 이미지 크기 @default "md" */
	size?: "sm" | "md" | "lg";
	/** 추가 CSS 클래스 */
	className?: string;
}

const sizeStyles = {
	sm: "w-10 h-10",
	md: "w-14 h-14",
	lg: "w-20 h-20",
};

/**
 * CircularImage 컴포넌트
 * 원형으로 잘린 이미지를 표시합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <CircularImage src="/profile.jpg" alt="프로필" />
 *
 * // 크기 변경
 * <CircularImage src="/avatar.png" alt="아바타" size="lg" />
 *
 * // 커스텀 스타일
 * <CircularImage src="/user.jpg" alt="사용자" className="border-2 border-accent" />
 * ```
 */
export const CircularImage = ({
	src,
	alt,
	size = "md",
	className,
}: CircularImageProps) => {
	return (
		<img
			src={src}
			alt={alt}
			className={cn("rounded-full object-cover", sizeStyles[size], className)}
		/>
	);
};
