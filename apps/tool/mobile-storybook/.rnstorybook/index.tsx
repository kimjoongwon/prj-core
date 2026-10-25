import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
	hasStoryWrapper: false,
	onDeviceUI: true,
	// 선택 항목 persistence는 선택 사항입니다. Expo Go에는 이 앱의 v3
	// 의존성이 사용하는 native AsyncStorage module이 없으므로 adapter를
	// 생략해 native preview에서도 Storybook을 사용할 수 있게 합니다.
	shouldPersistSelection: false,
});

export default StorybookUIRoot;
