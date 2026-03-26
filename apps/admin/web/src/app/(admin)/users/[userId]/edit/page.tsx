"use client";

import { UserEditPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

export default observer(function UserEditPageRoute() {
	const router = useRouter();

	return (
		<UserEditPage
			onClickBackButton={() => {
				router.back();
			}}
		/>
	);
});
