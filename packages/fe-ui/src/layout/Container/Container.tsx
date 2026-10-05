import { cva } from "class-variance-authority";

/**
 * Container 폭 역할.
 * 세로 리듬(flex-col/gap)은 소유하지 않고, 자식은 `VStack`/`HStack`으로 조합합니다.
 */
export type ContainerWidth = "narrow" | "content" | "page" | "wide" | "full";

export interface ContainerProps {
	/** 컨테이너 내부 콘텐츠 */
	children: React.ReactNode;
	/** 추가 CSS 클래스. 폭은 `width`로 지정하고 여백 등 조합에만 사용합니다. */
	className?: string;
	/** 폭 역할 (기본: `page`) */
	width?: ContainerWidth;
	/**
	 * Tailwind v4 container query 기준을 활성화합니다.
	 * 자식이 `@md:flex-row`처럼 이 컨테이너의 폭을 기준으로 반응할 수 있습니다.
	 */
	containerQuery?: boolean;
}

const container = cva("mx-auto w-full", {
	variants: {
		width: {
			narrow: "max-w-[40rem]",
			content: "max-w-4xl",
			page: "max-w-7xl",
			wide: "max-w-[96rem]",
			full: "max-w-none",
		},
		containerQuery: {
			true: "@container",
			false: "",
		},
	},
	defaultVariants: {
		width: "page",
		containerQuery: false,
	},
});

/**
 * Container 컴포넌트
 * 콘텐츠 폭을 역할 단위로 제한하고 중앙 정렬하는 구조 primitive입니다.
 * 세로 리듬은 소유하지 않으므로 자식은 `VStack`/`HStack`으로 조합합니다.
 *
 * @example
 * ```tsx
 * <Container width="page" className="py-8">
 *   <VStack gap="page">
 *     <HeroSection />
 *     <ContentSection />
 *   </VStack>
 * </Container>
 * ```
 *
 * @example container query — 이 컨테이너 폭 기준으로 자식이 반응
 * ```tsx
 * <Container containerQuery width="content">
 *   <div className="flex flex-col @md:flex-row">
 *     <Sidebar />
 *     <MainContent />
 *   </div>
 * </Container>
 * ```
 */
export const Container = (props: ContainerProps) => {
	const { className = "", children, width, containerQuery } = props;
	return (
		<div className={container({ className, width, containerQuery })}>
			{children}
		</div>
	);
};
