"use client";

import { UserDetailPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function UserDetailPageRoute() {
	const userId = useParams().userId as string;
	const router = useRouter();

	return (
		<UserDetailPage
			userId={userId}
			onClickBackButton={() => {
				router.push("/users" as Route);
			}}
		/>
	);
});
