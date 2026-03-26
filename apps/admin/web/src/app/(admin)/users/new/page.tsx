"use client";

import { UserCreatePage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function UserNewPageRoute() {
	const router = useRouter();

	return (
		<UserCreatePage
			onClickBackButton={() => {
				router.push("/users" as Route);
			}}
		/>
	);
});
