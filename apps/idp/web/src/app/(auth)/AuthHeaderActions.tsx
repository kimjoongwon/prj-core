"use client";

import { useStore } from "@cocrepo/store";
import { LanguageSelectButton, ThemeToggleButton } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export const AuthHeaderActions = observer(function AuthHeaderActions() {
	const store = useStore();
	const localeStore = store.localeStore;

	return (
		<div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
			{localeStore && (
				<LanguageSelectButton
					languageCode={localeStore.languageCode}
					onChangeLanguage={(languageCode) => {
						localeStore.setLanguageCode(languageCode);
					}}
					className="border-slate-200/70 bg-white/80 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-100 dark:hover:bg-slate-950"
				/>
			)}
			<ThemeToggleButton />
		</div>
	);
});
