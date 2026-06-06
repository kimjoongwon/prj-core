"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { Link as HeroLink } from "../../control/Link/Link";

export interface IdpAccountActionsCellProps {
	/** 계정 ID */
	accountId: string;
	/** 잠금 상태 */
	isLocked: boolean;
	/** 잠금 해제 콜백 */
	onUnlock: () => void;
}

/**
 * IDP 계정용 상세/잠금해제 액션 셀
 */
export const IdpAccountActionsCell = observer(function IdpAccountActionsCell({
	accountId,
	isLocked,
	onUnlock,
}: IdpAccountActionsCellProps) {
	return (
		<div className="flex items-center justify-center gap-1">
			{isLocked ? (
				<Button size="sm" variant="flat" color="primary" onPress={onUnlock}>
					잠금 해제
				</Button>
			) : null}
			<Button
				as={HeroLink}
				href={`/settings/auth/accounts/${accountId}`}
				size="sm"
				variant="light"
			>
				상세
			</Button>
		</div>
	);
});
