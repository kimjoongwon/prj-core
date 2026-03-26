"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { DetailPage, DetailPageSurface, DetailSectionCard } from "../../detail";
import { PageTitleBar } from "../../widget";

export interface SessionCheckPageProps {
	title: string;
	description: string;
	message?: string;
}

export const SessionCheckPage = observer(
	({
		title,
		description,
		message = "인증 상태를 확인한 뒤 적절한 페이지로 이동합니다.",
	}: SessionCheckPageProps) => {
		return (
			<DetailPage
				top={<PageTitleBar title={title} description={description} />}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
							<Spinner size="lg" />
							<p className="text-sm text-default-500">{message}</p>
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	},
);

SessionCheckPage.displayName = "SessionCheckPage";
