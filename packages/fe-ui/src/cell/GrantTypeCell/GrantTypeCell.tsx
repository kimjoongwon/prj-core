import { Chip } from "../../data-display/Chip/Chip";

interface GrantTypeCellProps {
	/** Grant Type 목록 */
	types: string[];
}

const GRANT_TYPE_LABEL: Record<string, string> = {
	authorization_code: "Auth Code",
	client_credentials: "Client Cred",
	refresh_token: "Refresh",
};

/**
 * Grant Types를 Chip 목록으로 표시하는 Cell 컴포넌트
 */
export const GrantTypeCell = ({ types }: GrantTypeCellProps) => {
	if (!types || types.length === 0) {
		return <p>-</p>;
	}

	return (
		<div className="flex flex-wrap gap-1">
			{types.map((type) => (
				<Chip key={type} size="sm" variant="flat">
					{GRANT_TYPE_LABEL[type] ?? type}
				</Chip>
			))}
		</div>
	);
};
