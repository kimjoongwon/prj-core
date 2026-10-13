"use client";

import {
	type AssetBrowserBindings,
	type AssetBrowserData,
	type UseAssetBrowserOptions,
	useAssetBrowser,
	useAssetBrowserData,
} from "@cocrepo/hook";
import {
	AssetBrowser,
	type AssetBrowserProps,
	AssetListScreen,
} from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Suspense } from "react";

export interface AssetBrowserFeatureProps
	extends UseAssetBrowserOptions,
		Pick<
			AssetBrowserProps,
			"mode" | "title" | "description" | "selectedAssetId" | "onSelectAsset"
		> {}

function AssetBrowserFeatureView({
	feature,
	bindings,
	assetData,
}: {
	feature: AssetBrowserFeatureProps;
	bindings: AssetBrowserBindings;
	assetData: AssetBrowserData;
}) {
	return feature.mode === "manage" ? (
		<AssetListScreen {...bindings} {...assetData} />
	) : (
		<AssetBrowser
			{...bindings}
			{...assetData}
			mode="picker"
			title={feature.title}
			description={feature.description}
			selectedAssetId={feature.selectedAssetId}
			onSelectAsset={feature.onSelectAsset}
		/>
	);
}

const AssetBrowserQueryContent = observer(function AssetBrowserQueryContent({
	feature,
	bindings,
}: {
	feature: AssetBrowserFeatureProps;
	bindings: AssetBrowserBindings;
}) {
	const assetData = useAssetBrowserData({
		queryStates: bindings.queryStates,
		forcedKind: feature.forcedKind,
		forcedStatus: feature.forcedStatus,
	});
	return (
		<AssetBrowserFeatureView
			feature={feature}
			bindings={bindings}
			assetData={assetData}
		/>
	);
});

/** 공간이 준비된 뒤에만 조회 자식을 mount하는 에셋 feature입니다. */
export const AssetBrowserFeature = observer(function AssetBrowserFeature(
	feature: AssetBrowserFeatureProps,
) {
	const bindings = useAssetBrowser(feature);
	if (!bindings.isSpaceReady || !bindings.hasSelectedSpace) {
		return (
			<AssetBrowserFeatureView
				feature={feature}
				bindings={bindings}
				assetData={{ totalCount: 0, folders: [] }}
			/>
		);
	}

	const queryContent = (
		<AssetBrowserQueryContent feature={feature} bindings={bindings} />
	);
	// picker 조회 경계는 폼이 유지되는 AssetBrowserModal의 Body가 소유합니다.
	return feature.mode === "picker" ? (
		queryContent
	) : (
		<Suspense
			fallback={
				<div className="flex min-h-64 items-center justify-center">
					<Spinner />
				</div>
			}
		>
			{queryContent}
		</Suspense>
	);
});
