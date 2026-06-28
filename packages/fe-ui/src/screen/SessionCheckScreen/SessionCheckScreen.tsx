"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
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
			<VStack fullWidth>
				<PageTitleBar title={title} description={description} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
								<Spinner size="lg" />
								<p className="text-sm text-muted">{t(message)}</p>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
SessionCheckScreen.displayName = "SessionCheckScreen";
