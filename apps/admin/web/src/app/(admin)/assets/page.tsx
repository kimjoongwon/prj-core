"use client";

import { AdminAssetsPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useAdminAssetBrowser } from "../hooks/useAdminAssetBrowser";

export default observer(function AssetsPageRoute() {
	const assetBrowser = useAdminAssetBrowser();

	return <AdminAssetsPage {...assetBrowser} />;
});
