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
					className="border-slate-200/70 bg-white/80 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-100 dark:hover:bg-slate-950"
				/>
			)}
			<ThemeToggleButton />
		</HStack>
	);
});
