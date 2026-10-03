"use client";

import { observer } from "mobx-react-lite";
import {
	AssetBrowser,
	type AssetBrowserProps,
	type AssetBrowserQueryStates,
	type AssetBrowserSetQueryStates,
	assetBrowserQueryInputs,
} from "../../domain/asset/AssetBrowser";
import { Container } from "../../layout";

export const adminAssetsPageQueryInputs = assetBrowserQueryInputs;

export type AssetListScreenQueryStates = AssetBrowserQueryStates;
export type AssetListScreenSetQueryStates = AssetBrowserSetQueryStates;

export interface AssetListScreenProps
	extends Omit<
		AssetBrowserProps,
		"mode" | "presentation" | "title" | "description"
	> {}

export const AssetListScreen = observer((props: AssetListScreenProps) => {
	return (
		<Container width="wide">
			<AssetBrowser
				{...props}
				mode="manage"
				presentation="inline"
				title="에셋 관리"
				description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
			/>
		</Container>
	);
});
