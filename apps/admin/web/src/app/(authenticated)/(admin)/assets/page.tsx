"use client";

import { useAssetBrowser } from "@cocrepo/hook";
import { AssetListScreen } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { observer } from "mobx-react-lite";

export default observer(function AssetsPageRoute() {
	const assetBrowser = useAssetBrowser({
		onNotify: ({ title, description }) => {
			toast.success(title, { description });
		},
	});

	return <AssetListScreen {...assetBrowser} />;
});
