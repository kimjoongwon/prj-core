"use client";

import { DesignSystemProvider } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { type ReactNode, useRef } from "react";
import { PlanSelectionProvider, PlanSelectionStore } from "../stores";

interface ProvidersProps {
	children: ReactNode;
}

/**
 * Proposal 앱 최상위 Provider
 */
export const Providers = observer(function Providers({
	children,
}: ProvidersProps) {
	const planSelectionStoreRef = useRef<PlanSelectionStore | null>(null);
	if (!planSelectionStoreRef.current) {
		planSelectionStoreRef.current = new PlanSelectionStore();
	}

	return (
		<DesignSystemProvider>
			<PlanSelectionProvider store={planSelectionStoreRef.current}>
				{children}
			</PlanSelectionProvider>
		</DesignSystemProvider>
	);
});
