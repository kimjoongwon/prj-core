"use client";

import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { AccountTenantSelect } from "../../domain/account";
import { Section } from "../../layout";
import { VStack } from "../../rhythm/VStack/VStack";
import { ScreenSurface, SectionSurface } from "../../surface";

export interface AccountTenantSelectScreenProps {
	/** 선택 카드의 짧은 문맥 표시입니다. */
	eyebrow: string;
	/** 화면의 주 안내 제목입니다. */
	title: string;
	/** tenant 선택 결과가 저장되는 방식을 설명합니다. */
	description: string;
}

/**
 * 로그인한 account가 작업할 tenant를 선택하는 독립 화면입니다.
 * tenant 조회와 선택 저장은 `AccountTenantSelect`에 위임합니다.
 */
export const AccountTenantSelectScreen = observer(
	({ eyebrow, title, description }: AccountTenantSelectScreenProps) => {
		return (
			<ScreenSurface
				variant="transparent"
				className="flex min-h-dvh items-center justify-center rounded-none bg-background px-6 py-10"
			>
				<SectionSurface className="max-w-md rounded-2xl shadow-sm">
					<Section>
						<Section.Header>
							<VStack fullWidth gap="inline">
								<Typography
									type="body-xs"
									weight="semibold"
									className="uppercase tracking-[0.2em] text-muted"
								>
									{eyebrow}
								</Typography>
								<Typography.Heading level={1}>{title}</Typography.Heading>
								<Typography.Paragraph color="muted" size="sm">
									{description}
								</Typography.Paragraph>
							</VStack>
						</Section.Header>
						<Section.Body>
							<VStack fullWidth>
								<AccountTenantSelect />
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</ScreenSurface>
		);
	},
);

AccountTenantSelectScreen.displayName = "AccountTenantSelectScreen";
