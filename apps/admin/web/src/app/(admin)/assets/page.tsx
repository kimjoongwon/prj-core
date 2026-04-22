"use client";

import { AssetListPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useAdminAssetBrowser } from "../hooks/useAdminAssetBrowser";

export default observer(function AssetsPageRoute() {
	const assetBrowser = useAdminAssetBrowser();

	return <AssetListPage {...assetBrowser} />;
});
