"use client";

import { AssetListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useAssetBrowser } from "@cocrepo/hook";

export default observer(function AssetsPageRoute() {
	const assetBrowser = useAssetBrowser();

	return (
		<>
			<AssetListScreen {...assetBrowser} />
		</>
	);
});
