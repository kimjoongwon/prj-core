import {
	Globe,
	Mail,
	MessageCircle,
	Phone,
	Smartphone,
	Users,
} from "lucide-react";

/** 문의 채널값 (Prisma Enum 값과 동일) */
export type InquiryChannelCode =
	| "WEB"
	| "EMAIL"
	| "CHAT"
	| "SMS"
	| "PHONE"
	| "WALK_IN";

interface InquiryChannelCellProps {
	/** 채널값 */
	value?: InquiryChannelCode | null;
}

/** 채널별 설정 */
const CHANNEL_CONFIG: Record<
	InquiryChannelCode,
	{ label: string; icon: React.ReactNode }
> = {
	WEB: { label: "웹 폼", icon: <Globe className="h-3.5 w-3.5" /> },
	EMAIL: { label: "이메일", icon: <Mail className="h-3.5 w-3.5" /> },
	CHAT: { label: "채팅", icon: <MessageCircle className="h-3.5 w-3.5" /> },
	SMS: { label: "SMS", icon: <Smartphone className="h-3.5 w-3.5" /> },
	PHONE: { label: "전화", icon: <Phone className="h-3.5 w-3.5" /> },
	WALK_IN: { label: "방문", icon: <Users className="h-3.5 w-3.5" /> },
};

/**
 * 문의 채널을 아이콘과 함께 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquiryChannelCell value="CHAT" />
 * <InquiryChannelCell value="EMAIL" />
 * ```
 */
export const InquiryChannelCell = ({ value }: InquiryChannelCellProps) => {
	if (!value) {
		return <span className="text-default-400">-</span>;
	}

	const config = CHANNEL_CONFIG[value];

	return (
		<div className="flex w-full items-center justify-center gap-1.5">
			<span className="text-default-500">{config.icon}</span>
			<span className="text-sm">{config.label}</span>
		</div>
	);
};
