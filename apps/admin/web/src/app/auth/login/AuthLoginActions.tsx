"use client";

import { HStack, LanguageSelectButton, ThemeToggleButton } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/stores/AppStoreProvider";

export const AuthLoginActions = observer(function AuthLoginActions() {
	const store = useAppStore();
	const localeStore = store.localeStore;

	return (
		<HStack
			alignItems="center"
			gap="inline"
			className="absolute right-4 top-4 z-20"
		>
			{localeStore && (
				<LanguageSelectButton
					value={localeStore.languageCode}
					onChange={(languageCode) => {
						localeStore.setLanguageCode(languageCode);
					}}
					className="border-divider bg-content1/80 text-foreground shadow-sm backdrop-blur-md hover:bg-content1"
				/>
			)}
			<ThemeToggleButton />
		</HStack>
	);
});
