import { Page, PageSurface, Section, SectionSurface } from "@cocrepo/ui";
import type { ReactNode } from "react";

export default function AssetsLayout({ children }: { children: ReactNode }) {
	return (
		<Page>
			<PageSurface>
				<Section>
					<SectionSurface elevation="flat">{children}</SectionSurface>
				</Section>
			</PageSurface>
		</Page>
	);
}
