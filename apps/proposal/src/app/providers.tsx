"use client";

import { DesignSystemProvider } from "@cocrepo/design-system";
import type { ReactNode } from "react";

interface ProvidersProps {
	children: ReactNode;
}

/**
 * Proposal 앱 최상위 Provider
 * 정적 사이트이므로 DesignSystemProvider만 사용
 */
export function Providers({ children }: ProvidersProps) {
	return <DesignSystemProvider>{children}</DesignSystemProvider>;
}
