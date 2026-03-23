import { Page, PageSurface, Section, SectionSurface } from "@cocrepo/ui";
import type { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
	return (
		<Page>
			<PageSurface>
				<Section>
					<SectionSurface elevation="flat" padding="none">
						{children}
					</SectionSurface>
				</Section>
			</PageSurface>
		</Page>
	);
}
