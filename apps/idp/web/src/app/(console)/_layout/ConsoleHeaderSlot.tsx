"use client";

import { useLogout } from "@cocrepo/api/idp/auth";
import { AppLogo, HeaderBar } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

const userInfo = {
	name: "IDP 관리자",
	role: "FULL_ACCESS",
};

export const ConsoleHeaderSlot = observer(function ConsoleHeaderSlot() {
	const { mutate: logoutMutate } = useLogout({
		mutation: {
			onSettled: () => {
				window.location.href = "/auth/login";
			},
		},
	});

	const onClickLogoutButton = () => {
		logoutMutate();
	};

	return (
		<HeaderBar
			userInfo={userInfo}
			onLogout={onClickLogoutButton}
			logo={<AppLogo icon="KeyRound" text="IDP 관리" />}
		/>
	);
});
