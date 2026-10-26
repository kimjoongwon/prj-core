"use client";

import { useInputStateInspection } from "@cocrepo/hook";
import { useEffect, useId, useRef } from "react";

export type StorybookStateReader = () => unknown;

/** Register a story-owned observable snapshot with the shared preview panel. */
export function useStorybookState(
	readState: StorybookStateReader,
	label = "story-state",
): void {
	const inspection = useInputStateInspection();
	const stableId = useId();
	const readerRef = useRef(readState);
	readerRef.current = readState;

	useEffect(() => {
		if (!inspection) return;
		const id = `${label}:${stableId}`;
		const reader = () => readerRef.current();
		return inspection.registerInputState(id, reader);
	}, [inspection, label, stableId]);
}
