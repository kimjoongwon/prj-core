"use client";

import { LanguageCode } from "@cocrepo/constant";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { Check, Languages } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

export interface LanguageSelectButtonProps {
	languageCode: LanguageCode;
	onChangeLanguage: (languageCode: LanguageCode) => void;
	className?: string;
	compact?: boolean;
}

const LANGUAGE_OPTIONS = [
	{ code: LanguageCode.ko_KR, label: "한국어" },
	{ code: LanguageCode.en_US, label: "English" },
	{ code: LanguageCode.zh_CN, label: "中文" },
	{ code: LanguageCode.ja_JP, label: "日本語" },
] satisfies Array<{ code: LanguageCode; label: string }>;

export const LanguageSelectButton = observer(function LanguageSelectButton({
	languageCode,
	onChangeLanguage,
	className,
	compact = true,
}: LanguageSelectButtonProps) {
	const t = useT();
	const selectedLabel =
		LANGUAGE_OPTIONS.find((option) => option.code === languageCode)?.label ??
		LANGUAGE_OPTIONS[0].label;

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button
					variant="light"
					isIconOnly={compact}
					className={className}
					aria-label={t("언어 선택")}
					startContent={compact ? undefined : <Languages size={16} />}
				>
					{compact ? <Languages size={18} /> : selectedLabel}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label={t("언어 선택")}
				selectedKeys={[languageCode]}
				selectionMode="single"
				onAction={(key) => {
					onChangeLanguage(key as LanguageCode);
				}}
			>
				{LANGUAGE_OPTIONS.map((option) => (
					<DropdownItem
						key={option.code}
						endContent={
							option.code === languageCode ? <Check size={16} /> : null
						}
						textValue={option.label}
					>
						{option.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
});
