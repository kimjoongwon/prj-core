"use client";

import { observer } from "mobx-react-lite";
import {
	AssetBrowser,
	type AssetBrowserAsset,
	type AssetBrowserProps,
	type AssetBrowserQueryStates,
	type AssetBrowserSetQueryStates,
	assetBrowserQueryInputs,
} from "../../feature/AssetBrowser";

export const adminAssetsPageQueryInputs = assetBrowserQueryInputs;

export type AdminAssetsPageQueryStates = AssetBrowserQueryStates;
export type AdminAssetsPageSetQueryStates = AssetBrowserSetQueryStates;
export type AdminAssetsPageAsset = AssetBrowserAsset;

export interface AdminAssetsPageProps
	extends Omit<
		AssetBrowserProps,
		"mode" | "presentation" | "title" | "description"
	> {}

export const AdminAssetsPage = observer((props: AdminAssetsPageProps) => {
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
