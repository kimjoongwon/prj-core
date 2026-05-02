import { Chip } from "@cocrepo/ui/heroui";

/**
 * AI 제공자 타입
 */
type AIProvider = "OPENAI" | "ANTHROPIC";

interface AIProviderCellProps {
	/** AI 제공자 */
	provider?: AIProvider;
}

/**
 * AI 제공자를 Chip으로 표시하는 Cell 컴포넌트
 */
export const AIProviderCell = ({ provider }: AIProviderCellProps) => {
	const config = PROVIDER_CONFIG[provider ?? "OPENAI"];

	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color={config.color} variant="flat">
				{config.label}
			</Chip>
		</div>
	);
};

const PROVIDER_CONFIG: Record<
	AIProvider,
	{
		label: string;
		color:
			| "primary"
			| "secondary"
			| "success"
			| "warning"
			| "danger"
			| "default";
	}
> = {
	OPENAI: { label: "OpenAI", color: "success" },
	ANTHROPIC: { label: "Anthropic", color: "secondary" },
};

export type { AIProviderCellProps };
