"use client";

import { useInputStateInspection } from "@cocrepo/hook/input-state-inspection";
import { useEffect, useId, useRef } from "react";

export function useRegisterInputState(
	readValue: () => unknown,
	revision?: unknown,
) {
	const inspection = useInputStateInspection();
	const inputId = useId();
	const readerRef = useRef(readValue);
	readerRef.current = readValue;

	useEffect(() => {
		if (!inspection) return undefined;
		return inspection.registerInputState(inputId, () => readerRef.current());
	}, [inputId, inspection, revision]);
}
