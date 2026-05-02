"use client";

import type { LanguageCode } from "@cocrepo/constant";
import { LanguageSelectButton, ThemeToggleButton } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useLocaleStore } from "@/stores";

export const AuthTopActions = observer(function AuthTopActions() {
	const localeStore = useLocaleStore();

	const onChangeLanguage = (languageCode: LanguageCode) => {
		localeStore.setLanguageCode(languageCode);
	};

	return (
		<div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
			<LanguageSelectButton
				value={localeStore.languageCode}
				onChange={onChangeLanguage}
			/>
			<ThemeToggleButton />
		</div>
	);
});
