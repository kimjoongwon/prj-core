"use client";

import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { observer } from "mobx-react-lite";
import { Spinner } from "@heroui/react";
import { useT } from "../../i18n";
import { PageTitleBar } from "../../widget";
export interface SessionCheckScreenProps {
	title: string;
	description: string;
	message?: string;
}
export const SessionCheckScreen = observer(
	({
		title,
		description,
		message = "인증 상태를 확인한 뒤 적절한 페이지로 이동합니다.",
	}: SessionCheckScreenProps) => {
		const t = useT();
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar title={title} description={description} />

				<SectionSurface>
					<div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
						<Spinner size="lg" />
						<p className="text-sm text-muted">{t(message)}</p>
					</div>
				</SectionSurface>
			</VStack>
		);
	},
);
SessionCheckScreen.displayName = "SessionCheckScreen";
