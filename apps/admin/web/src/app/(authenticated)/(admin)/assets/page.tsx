"use client";

import { toast } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { AssetBrowserFeature } from "@/features/asset/AssetBrowserFeature";

export default observer(function AssetsPageRoute() {
	return (
		<AssetBrowserFeature
			mode="manage"
			title="에셋 관리"
			description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
			onNotify={({ title, description }) => {
				toast.success(title, { description });
			}}
		/>
	);
});
