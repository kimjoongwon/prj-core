"use client";

import { UserEditScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

export default observer(function UserEditScreenRoute() {
	const router = useRouter();

	return (
		<>
			<UserEditScreen
				onClickBackButton={() => {
					router.back();
				}}
			/>
		</>
	);
});
