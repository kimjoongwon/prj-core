"use client";

import { observer } from "mobx-react-lite";
import {
	AssetBrowser,
	type AssetBrowserProps,
	type AssetBrowserQueryStates,
	type AssetBrowserSetQueryStates,
	assetBrowserQueryInputs,
} from "../../feature/AssetBrowser";

export const adminAssetsPageQueryInputs = assetBrowserQueryInputs;

export type AssetListPageQueryStates = AssetBrowserQueryStates;
export type AssetListPageSetQueryStates = AssetBrowserSetQueryStates;

export interface AssetListPageProps
	extends Omit<
		AssetBrowserProps,
		"mode" | "presentation" | "title" | "description"
	> {}

export const AssetListPage = observer((props: AssetListPageProps) => {
	return (
		<AssetBrowser
			{...props}
			mode="manage"
			presentation="inline"
			title="에셋 관리"
			description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
		/>
	);
});
