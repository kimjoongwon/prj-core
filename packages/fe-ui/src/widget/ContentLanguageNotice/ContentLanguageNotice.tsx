"use client";

import { Chip } from "@heroui/react";
import { Languages } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

export type ContentLanguageCode = "ko_KR" | "en_US" | "zh_CN" | "ja_JP";

const LANGUAGE_LABELS: Record<ContentLanguageCode, string> = {
	ko_KR: "한국어",
	en_US: "English",
	zh_CN: "中文",
	ja_JP: "日本語",
};

export const CONTENT_LANGUAGE_OPTIONS = [
	{ code: "ko_KR", label: LANGUAGE_LABELS.ko_KR },
	{ code: "en_US", label: LANGUAGE_LABELS.en_US },
	{ code: "zh_CN", label: LANGUAGE_LABELS.zh_CN },
	{ code: "ja_JP", label: LANGUAGE_LABELS.ja_JP },
] satisfies { code: ContentLanguageCode; label: string }[];

export function toContentLanguageCode(
	value?: string | null,
): ContentLanguageCode | null {
	if (
		value === "ko_KR" ||
		value === "en_US" ||
		value === "zh_CN" ||
		value === "ja_JP"
	) {
		return value;
	}

	return null;
}

export interface ContentLanguageNoticeProps {
	contentLanguageCode?: string | null;
}

export const ContentLanguageNotice = observer(
	({ contentLanguageCode }: ContentLanguageNoticeProps) => {
		const t = useT();
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const label = languageCode ? LANGUAGE_LABELS[languageCode] : t("미설정");

		return (
			<div className="flex flex-wrap items-center gap-2 rounded-lg border border-divider bg-content2/50 px-3 py-2 text-sm text-default-600">
				<Languages className="h-4 w-4 text-default-500" />
				<span>{t("현재 Space 콘텐츠 언어")}</span>
				<Chip size="sm" variant="flat" color={languageCode ? "primary" : "warning"}>
					{label}
				</Chip>
			</div>
		);
	},
);
