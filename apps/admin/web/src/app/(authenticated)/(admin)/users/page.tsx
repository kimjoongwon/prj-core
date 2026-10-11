"use client";

import { UserListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { usePage } from "./_hooks/usePage";

function UsersPageRoute() {
	const page = usePage();
	const { state } = page;

	return <UserListScreen state={state} />;
}

export default observer(UsersPageRoute);
