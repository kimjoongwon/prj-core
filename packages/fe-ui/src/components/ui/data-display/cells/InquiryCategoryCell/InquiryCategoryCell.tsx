import {
	AlertCircle,
	CreditCard,
	HelpCircle,
	MoreHorizontal,
	Package,
	RotateCcw,
	Truck,
	User,
	Wrench,
} from "lucide-react";

/** 문의 카테고리값 (Prisma Enum 값과 동일) */
export type InquiryCategoryCode =
	| "GENERAL"
	| "DELIVERY"
	| "PAYMENT"
	| "REFUND"
	| "PRODUCT"
	| "ACCOUNT"
	| "TECHNICAL"
	| "COMPLAINT"
	| "OTHER";

interface InquiryCategoryCellProps {
	/** 카테고리값 */
	value?: InquiryCategoryCode | null;
}

/** 카테고리별 설정 */
const CATEGORY_CONFIG: Record<
	InquiryCategoryCode,
	{ label: string; icon: React.ReactNode }
> = {
	GENERAL: { label: "일반", icon: <HelpCircle className="h-3.5 w-3.5" /> },
	DELIVERY: { label: "배송", icon: <Truck className="h-3.5 w-3.5" /> },
	PAYMENT: { label: "결제", icon: <CreditCard className="h-3.5 w-3.5" /> },
	REFUND: { label: "환불/취소", icon: <RotateCcw className="h-3.5 w-3.5" /> },
	PRODUCT: { label: "상품", icon: <Package className="h-3.5 w-3.5" /> },
	ACCOUNT: { label: "계정", icon: <User className="h-3.5 w-3.5" /> },
	TECHNICAL: { label: "기술 지원", icon: <Wrench className="h-3.5 w-3.5" /> },
	COMPLAINT: {
		label: "불만/불편",
		icon: <AlertCircle className="h-3.5 w-3.5" />,
	},
	OTHER: { label: "기타", icon: <MoreHorizontal className="h-3.5 w-3.5" /> },
};

/**
 * 문의 카테고리를 아이콘과 함께 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquiryCategoryCell value="DELIVERY" />
 * <InquiryCategoryCell value="PAYMENT" />
 * ```
 */
export const InquiryCategoryCell = ({ value }: InquiryCategoryCellProps) => {
	if (!value) {
		return <span className="text-default-400">-</span>;
	}

	const config = CATEGORY_CONFIG[value];

	return (
		<div className="flex w-full items-center justify-center gap-1.5">
			<span className="text-default-500">{config.icon}</span>
			<span className="text-sm">{config.label}</span>
		</div>
	);
};
