"use client";

import { useGetUserById } from "@cocrepo/api/core/users";
import { UserDetailScreen, type UserDetailScreenUser } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function UserDetailScreenRoute() {
	const { userId } = useParams<{ userId: string }>();
	const router = useRouter();
	const { data: userResponse, isLoading } = useGetUserById(userId);
	const user = userResponse?.data as UserDetailScreenUser | undefined;

	const onClickBackButton = () => {
		router.push("/users" as Route);
	};

	return (
		<UserDetailScreen
			userId={userId}
			user={user}
			isLoading={isLoading}
			onClickBackButton={onClickBackButton}
		/>
	);
});
