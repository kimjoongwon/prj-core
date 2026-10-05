import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
	hasStoryWrapper: false,
	onDeviceUI: true,
	shouldPersistSelection: true,
	storage: {
		getItem: AsyncStorage.getItem,
		setItem: AsyncStorage.setItem,
	},
});

export default StorybookUIRoot;
