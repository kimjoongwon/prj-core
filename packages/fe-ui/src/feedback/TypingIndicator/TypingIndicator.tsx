import { cva, type VariantProps } from "class-variance-authority";

const typingIndicatorVariants = cva(
	"inline-flex items-center gap-1 text-xs text-muted",
	{
		variants: {
			size: {
				sm: "text-[10px]",
				md: "text-xs",
				lg: "text-sm",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export interface TypingIndicatorProps
	extends VariantProps<typeof typingIndicatorVariants> {
	/** 타이핑 중인 사용자 이름 목록 */
	userNames: string[];
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 타이핑 중인 사용자를 표시하는 인디케이터 컴포넌트
 *
 * @example
 * ```tsx
 * <TypingIndicator userNames={["홍길동"]} />
 * <TypingIndicator userNames={["홍길동", "김철수"]} />
 * ```
 */
export const TypingIndicator = ({
	userNames,
	size,
	className,
}: TypingIndicatorProps) => {
	if (!userNames || userNames.length === 0) {
		return null;
	}

	const getTypingText = () => {
		if (userNames.length === 1) {
			return `${userNames[0]}님이 타이핑 중입니다...`;
		}
		if (userNames.length === 2) {
			return `${userNames[0]}님과 ${userNames[1]}님이 타이핑 중입니다...`;
		}
		return `${userNames[0]}님 외 ${userNames.length - 1}명이 타이핑 중입니다...`;
	};

	return (
		<div className={typingIndicatorVariants({ size, className })}>
			<span className="inline-flex gap-0.5">
				<span className="animate-bounce delay-0">.</span>
				<span className="animate-bounce delay-100">.</span>
				<span className="animate-bounce delay-200">.</span>
			</span>
			<span>{getTypingText()}</span>
		</div>
	);
};
