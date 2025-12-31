import type { ReactNode } from "react";
import { renderLucideIcon } from "../../../../utils";
import { Text } from "../../data-display/Text/Text";

export interface LogoProps {
	/** 아이콘 이름 (Lucide 아이콘) */
	icon?: string;
	/** 로고 텍스트 */
	text?: string;
	/** 커스텀 로고 컨텐츠 (icon/text 대신 사용) */
	children?: ReactNode;
	/** 클릭 핸들러 */
	onClick?: () => void;
}

/**
 * Logo 컴포넌트
 * Header의 logo 영역에 사용
 *
 * @example
 * ```tsx
 * <Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />
 * ```
 */
export const Logo = ({ icon, text, children, onClick }: LogoProps) => {
	const handleClick = () => {
		onClick?.();
	};

	return (
		<div
			className="flex cursor-pointer items-center"
			onClick={handleClick}
			onKeyDown={(e) => e.key === "Enter" && handleClick()}
			role="button"
			tabIndex={0}
		>
			{children ?? (
				<>
					{icon && renderLucideIcon(icon, "h-6 w-6 text-primary", 24)}
					{text && (
						<Text variant="h5" className="ml-2 font-bold">
							{text}
						</Text>
					)}
				</>
			)}
		</div>
	);
};

Logo.displayName = "Logo";
