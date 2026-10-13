import { Typography } from "../../../data-display/Typography";
import { useHandlers } from "./useHandlers";

export interface PhoneCellProps {
	/** 전화번호 */
	value?: string | null;
	/** 추가 클래스 */
	className?: string;
	/** title 속성 */
	title?: string;
}

/**
 * 전화번호를 포맷팅하여 표시하는 Cell 컴포넌트
 * - 01012345678 → 010-1234-5678
 * - 이미 포맷팅된 번호는 그대로 표시
 */
/** 셀 마크업(text-[13px])과 동일한 크기를 유지하는 폴백 클래스입니다. */
const DATA_CELL_SIZE_FALLBACK_CLASS_NAME = "text-[13px]";

export const PhoneCell = (state: PhoneCellProps) => {
	const { value, className, title } = state;
	const handlers = useHandlers(state);

	return (
		<Typography
			className={[DATA_CELL_SIZE_FALLBACK_CLASS_NAME, className]
				.filter(Boolean)
				.join(" ")}
			color={!value ? "muted" : undefined}
			title={title}
			type="body-sm"
		>
			{handlers.getDisplayPhoneNumber()}
		</Typography>
	);
};
