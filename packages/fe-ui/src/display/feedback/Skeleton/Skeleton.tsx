import {
	Skeleton as NextSkeleton,
	type SkeletonProps,
} from "@cocrepo/ui/heroui";

/**
 * Skeleton 컴포넌트
 * 콘텐츠 로딩 중 플레이스홀더를 표시합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Skeleton className="h-4 w-full rounded" />
 *
 * // 여러 줄 스켈레톤
 * <div className="flex flex-col gap-2">
 *   <Skeleton className="h-4 w-3/4 rounded" />
 *   <Skeleton className="h-4 w-full rounded" />
 *   <Skeleton className="h-4 w-1/2 rounded" />
 * </div>
 *
 * // 원형 스켈레톤 (아바타용)
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 */
export function Skeleton(props: SkeletonProps) {
	return <NextSkeleton {...props} />;
}
