"use client";

import { useLogout } from "@cocrepo/api/idp/auth";
import type { SpaceInfo } from "@cocrepo/ui";
import { AppLogo, HeaderBar, HeaderSpaceSelector } from "@cocrepo/ui";
import { Button, Tooltip } from "@heroui/react";
import { KeyRound } from "lucide-react";
import { observer } from "mobx-react-lite";
import { resolveIdpClientUrl } from "@/runtime-urls";
import { usePersistStore } from "@/stores/AppStoreProvider";

const userInfo = {
	name: "관리자",
	role: "Owner",
};

export const AdminHeaderSlot = observer(function AdminHeaderSlot() {
	const persistStore = usePersistStore();
	const { mutate: logoutMutate } = useLogout({
		mutation: {
			onSettled: () => {
				persistStore.clearSpace();
				window.location.href = "/admin/auth/login";
			},
		},
	});

	const onClickLogoutButton = () => {
		logoutMutate();
	};

	const onSelectSpace = (space: SpaceInfo) => {
		persistStore.setSpace(space.spaceId, space.groundName);
		window.location.reload();
	};

	const onClickOpenIdpClientButton = () => {
		const idpClientUrl = resolveIdpClientUrl();
		if (idpClientUrl) {
			window.open(idpClientUrl, "_blank");
		}
	};

	return (
		<HeaderBar
			userInfo={userInfo}
			onLogout={onClickLogoutButton}
			logo={<AppLogo icon="LayoutGrid" text="플레이트" />}
			actions={
				<>
					<Tooltip content="IDP 관리" placement="bottom">
						<Button
							variant="light"
							isIconOnly
							size="sm"
							aria-label="IDP 관리 콘솔 열기"
							onPress={onClickOpenIdpClientButton}
						>
							<KeyRound className="h-5 w-5 text-default-500" size={20} />
						</Button>
					</Tooltip>
					<HeaderSpaceSelector
						spaces={persistStore.spaces}
						currentSpaceId={persistStore.spaceId}
						currentSpaceName={persistStore.groundName}
						onSpaceSelect={onSelectSpace}
					/>
				</>
			}
		/>
	);
});
