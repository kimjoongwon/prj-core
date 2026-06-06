import { Chip } from "../../data-display/Chip/Chip";

/**
 * 모델 타입별 컬러 설정
 */
const MODEL_TYPE_CONFIG: Record<
	string,
	{
		label: string;
		color: "primary" | "secondary" | "warning" | "success" | "default";
	}
> = {
	AccessToken: { label: "Access Token", color: "primary" },
	RefreshToken: { label: "Refresh Token", color: "secondary" },
	AuthorizationCode: { label: "Auth Code", color: "warning" },
	Session: { label: "Session", color: "success" },
	Grant: { label: "Grant", color: "default" },
	ClientCredentials: { label: "Client Cred", color: "primary" },
	DeviceCode: { label: "Device Code", color: "warning" },
	Interaction: { label: "Interaction", color: "success" },
};

interface ModelTypeCellProps {
	/** OIDC 모델 타입 */
	type: string;
}

/**
 * OIDC 모델 타입을 컬러 코딩된 Chip으로 표시하는 Cell 컴포넌트
 */
export const ModelTypeCell = ({ type }: ModelTypeCellProps) => {
	const config = MODEL_TYPE_CONFIG[type] ?? {
		label: type,
		color: "default" as const,
	};

	return (
		<Chip size="sm" color={config.color} variant="flat">
			{config.label}
		</Chip>
	);
};
