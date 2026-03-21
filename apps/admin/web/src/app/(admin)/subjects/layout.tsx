import type { ReactNode } from "react";
import { Page, PageSurface, Section, SectionSurface } from "@cocrepo/ui";

export default function SubjectsLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Page>
			<PageSurface padding="none">
				<Section>
					<SectionSurface className="overflow-hidden">{children}</SectionSurface>
				</Section>
			</PageSurface>
		</Page>
	);
}
