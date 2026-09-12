import { AccountTenantSelectScreen } from "@cocrepo/ui";

/** 로그인한 account가 작업할 Space를 선택하는 route입니다. */
export default function SelectSpacePage() {
	return (
		<AccountTenantSelectScreen
			eyebrow="Current Space"
			title="작업할 공간을 선택하세요"
			description="선택한 공간은 계정에 저장되어 다음 접속에도 유지됩니다."
		/>
	);
}
