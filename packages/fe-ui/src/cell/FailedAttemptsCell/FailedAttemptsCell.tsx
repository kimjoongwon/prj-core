export interface FailedAttemptsCellProps {
	/** 실패 횟수 */
	count: number;
}

/**
 * 로그인 실패 횟수를 강조 표시하는 셀
 */
export const FailedAttemptsCell = ({ count }: FailedAttemptsCellProps) => {
	const isDanger = count >= 5;

	return (
		<div className="flex w-full justify-center">
			<span className={isDanger ? "font-semibold text-danger" : undefined}>
				{count}
			</span>
		</div>
	);
};
