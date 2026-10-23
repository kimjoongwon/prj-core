import { DesignSystemProvider } from "@cocrepo/ui";
import type { ReactNode } from "react";

/** UI 키트 라우트에만 라이트/다크 테마 관리를 제공합니다. */
export default function ComponentGalleryLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <DesignSystemProvider>{children}</DesignSystemProvider>;
}
