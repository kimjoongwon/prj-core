import { Page, PageSurface, Section, SectionSurface } from "@cocrepo/ui";
import type { ReactNode } from "react";

export default function ActionsLayout({ children }: { children: ReactNode }) {
	return (
		<Page>
			<PageSurface padding="none">
				<Section>
					<SectionSurface elevation="flat" padding="none">
						{children}
					</SectionSurface>
				</Section>
			</PageSurface>
		</Page>
	);
}
