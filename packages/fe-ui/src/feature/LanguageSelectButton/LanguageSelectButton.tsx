"use client";

import { LanguageCode } from "@cocrepo/constant";
import {
	Button,
	cn,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { Check, Globe2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

export interface LanguageSelectButtonProps {
	value: LanguageCode;
	onChange: (languageCode: LanguageCode) => void;
	className?: string;
	compact?: boolean;
	isDisabled?: boolean;
}

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

export const LanguageSelectButton = observer(function LanguageSelectButton({
	value,
	onChange,
	className,
	compact = false,
	isDisabled = false,
}: LanguageSelectButtonProps) {
	const t = useT();
	const currentOption =
		LANGUAGE_OPTIONS.find((option) => option.value === value) ??
		LANGUAGE_OPTIONS[0];
	const ariaLabel = t("언어 선택");

	const handleSelectLanguage = (languageCode: LanguageCode) => {
		onChange(languageCode);
	};

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button
					variant="light"
					size="sm"
					radius={compact ? "lg" : "full"}
					isDisabled={isDisabled}
					aria-label={ariaLabel}
					startContent={<Globe2 className="h-4 w-4" size={16} />}
					className={cn(
						compact
							? "h-10 min-w-0 rounded-2xl border border-slate-200/70 bg-white/72 px-3 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
							: "border-slate-200/70 bg-white/80 text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-slate-950/75 dark:text-slate-100 dark:hover:bg-slate-950",
						className,
					)}
				>
					{compact ? currentOption.shortLabel : t(currentOption.labelKey)}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label={ariaLabel}
				variant="flat"
				selectionMode="single"
				selectedKeys={[value]}
			>
				{LANGUAGE_OPTIONS.map((option) => (
					<DropdownItem
						key={option.value}
						textValue={t(option.labelKey)}
						startContent={
							option.value === value ? (
								<Check className="h-4 w-4 text-primary" size={16} />
							) : (
								<span className="h-4 w-4" />
							)
						}
						onPress={() => handleSelectLanguage(option.value)}
					>
						<span className="flex items-center justify-between gap-4">
							<span>{t(option.labelKey)}</span>
							<span className="text-xs font-semibold text-default-400">
								{option.shortLabel}
							</span>
						</span>
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
});
