import { cva } from "class-variance-authority";

export interface ContainerProps {
	/** 컨테이너 내부 콘텐츠 */
	children: React.ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
}

const container = cva("flex flex-col");

/**
 * Container 컴포넌트
 * 기본적인 flex-col 레이아웃을 제공하는 컨테이너입니다.
 *
 * @example
 * ```tsx
 * <Container className="gap-4">
 *   <Header />
 *   <Content />
 *   <Footer />
 * </Container>
 * ```
 */
export const Container = (props: ContainerProps) => {
	const { className = "", children } = props;
	return <div className={container({ className })}>{children}</div>;
};
