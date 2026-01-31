"use client";

import { DesignSystemProvider } from "@cocrepo/design-system";
import { useMemo, type ReactNode } from "react";
import {
	PlanSelectionProvider,
	PlanSelectionStore,
} from "../stores";

interface ProvidersProps {
	children: ReactNode;
}

/**
 * Proposal 앱 최상위 Provider
 */
export function Providers({ children }: ProvidersProps) {
	// Store 인스턴스 생성 (클라이언트에서 한 번만)
	const planSelectionStore = useMemo(() => new PlanSelectionStore(), []);

	return (
		<DesignSystemProvider>
			<PlanSelectionProvider store={planSelectionStore}>
				{children}
			</PlanSelectionProvider>
		</DesignSystemProvider>
	);
}
