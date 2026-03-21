import type { ReactNode } from "react";
import { Page, PageSurface, Section, SectionSurface } from "@cocrepo/ui";

export default function TimelinesLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Page>
			<PageSurface>
				<Section>
					<SectionSurface className="overflow-hidden">{children}</SectionSurface>
				</Section>
			</PageSurface>
		</Page>
	);
}
