"use client";

import { UserCreateScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function UserNewPageRoute() {
	const router = useRouter();

	return (
		<>
			<UserCreateScreen
				onClickBackButton={() => {
					router.push("/users" as Route);
				}}
			/>
		</>
	);
});
