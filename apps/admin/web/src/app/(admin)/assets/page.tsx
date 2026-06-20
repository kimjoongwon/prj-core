"use client";

import { useAssetBrowser } from "@cocrepo/hook";
import { AssetListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export default observer(function AssetsPageRoute() {
	const assetBrowser = useAssetBrowser();

	return (
		<>
			<AssetListScreen {...assetBrowser} />
		</>
	);
});
