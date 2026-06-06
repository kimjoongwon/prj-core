import { Skeleton as HeroSkeleton } from "@heroui/react";
import type { ComponentProps } from "react";

export type SkeletonProps = ComponentProps<typeof HeroSkeleton>;

/**
 * Skeleton 컴포넌트
 * 콘텐츠 로딩 중 플레이스홀더를 표시합니다.
 */
export function Skeleton(props: SkeletonProps) {
	return <HeroSkeleton {...props} />;
}
