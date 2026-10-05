"use client";

import { LanguageCode } from "@cocrepo/constant";
import { useApp } from "@cocrepo/store";
import { cn, Dropdown } from "@heroui/react";
import { Check, Globe2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";

interface LanguageOption {
	value: LanguageCode;
	labelKey: string;
	shortLabel: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
	{ value: LanguageCode.ko_KR, labelKey: "한국어", shortLabel: "KO" },
	{ value: LanguageCode.en_US, labelKey: "영어", shortLabel: "EN" },
	{ value: LanguageCode.zh_CN, labelKey: "중국어", shortLabel: "ZH" },
	{ value: LanguageCode.ja_JP, labelKey: "일본어", shortLabel: "JA" },
];

const languageSelectButtonClassName =
	"h-10 min-w-0 rounded-2xl border border-border bg-surface px-3 text-xs font-semibold text-foreground shadow-sm hover:bg-surface-hover";

/** 현재 앱 언어를 표시하고 선택한 언어를 전역 LanguageStore에 반영합니다. */
export const LanguageSelectButton = observer(function LanguageSelectButton() {
	const language = useApp().language;
	const t = useT();
	const currentLanguageCode = language.languageCode;
	const currentOption =
		LANGUAGE_OPTIONS.find((option) => option.value === currentLanguageCode) ??
		LANGUAGE_OPTIONS[0];
	const ariaLabel = t("언어 선택");

	const handleSelectLanguage = (languageCode: LanguageCode) => {
		language.setLanguageCode(languageCode);
	};

	return (
		<Dropdown>
			<Dropdown.Trigger
				aria-label={ariaLabel}
				className={cn(
					"inline-flex items-center justify-center gap-2 transition-colors",
					languageSelectButtonClassName,
				)}
			>
				<Globe2 className="h-4 w-4" size={16} />
				{currentOption.shortLabel}
			</Dropdown.Trigger>
			<Dropdown.Popover placement="bottom end">
				<Dropdown.Menu aria-label={ariaLabel}>
					{LANGUAGE_OPTIONS.map((option) => (
						<Dropdown.Item
							id={option.value}
							key={option.value}
							textValue={t(option.labelKey)}
							onAction={() => handleSelectLanguage(option.value)}
						>
							<span className="flex items-center justify-between gap-4">
								{option.value === currentLanguageCode ? (
									<Check className="h-4 w-4 text-accent" size={16} />
								) : (
									<span className="h-4 w-4" />
								)}
								<span>{t(option.labelKey)}</span>
								<span className="text-xs font-semibold text-muted">
									{option.shortLabel}
								</span>
							</span>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	);
});
