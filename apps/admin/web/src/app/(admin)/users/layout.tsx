import type { ReactNode } from "react";
import {
	Page,
	PageSurface,
	PageTitleBar,
	Section,
	SectionSurface,
	Surface,
} from "@cocrepo/ui";

/**
 * 회원 관리 레이아웃
 *
 * route-level skeleton과 surface ownership은 서버 layout.tsx가 담당합니다.
 */
export default function UsersLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Page
			top={
				<Section>
					<Surface elevation="flat">
						<PageTitleBar
							title="이용자 목록"
							description="시스템에 등록된 이용자를 조회합니다."
						/>
					</Surface>
				</Section>
			}
		>
			<PageSurface padding="none">
				<Section>
					<SectionSurface className="overflow-hidden">{children}</SectionSurface>
				</Section>
			</PageSurface>
		</Page>
	);
}
