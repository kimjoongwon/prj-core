export interface PhoneCellProps {
	/** 전화번호 */
	value?: string | null;
}

/**
 * 전화번호를 포맷팅하여 표시하는 Cell 컴포넌트
 * - 01012345678 → 010-1234-5678
 * - 이미 포맷팅된 번호는 그대로 표시
 */
export const PhoneCell = ({ value }: PhoneCellProps) => {
	if (!value) {
		return <span className="text-default-400">-</span>;
	}

	// 이미 하이픈이 포함되어 있으면 그대로 표시
	if (value.includes("-")) {
		return <span>{value}</span>;
	}

	// 숫자만 추출
	const digits = value.replace(/\D/g, "");

	// 전화번호 포맷팅
	let formatted = digits;
	if (digits.length === 11) {
		// 010-1234-5678
		formatted = digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
	} else if (digits.length === 10) {
		// 02-1234-5678 또는 031-123-4567
		if (digits.startsWith("02")) {
			formatted = digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
		} else {
			formatted = digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		}
	}

	return <span>{formatted}</span>;
};
