import { Chip } from "../../design-system/primitives";

interface AuthMethodCellProps {
	/** 토큰 엔드포인트 인증 방식 */
	method: string;
}

const AUTH_METHOD_CONFIG: Record<
	string,
	{ label: string; color: "primary" | "secondary" | "warning" | "default" }
> = {
	client_secret_basic: { label: "Basic", color: "primary" },
	client_secret_post: { label: "Post", color: "secondary" },
	none: { label: "None (Public)", color: "warning" },
};

/**
 * 토큰 엔드포인트 인증 방식을 Chip으로 표시하는 Cell 컴포넌트
 */
export const AuthMethodCell = ({ method }: AuthMethodCellProps) => {
	const config = AUTH_METHOD_CONFIG[method] ?? {
		label: method,
		color: "default" as const,
	};

	return (
		<Chip size="sm" color={config.color} variant="flat">
			{config.label}
		</Chip>
	);
};
