"use client";

import {
	createContext,
	createElement,
	useContext,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from "react";

export type InputStateReader = () => unknown;

export interface InputStateInspection {
	registerInputState: (id: string, reader: InputStateReader) => () => void;
	read: (id: string) => unknown;
	entries: () => readonly string[];
}

type InputStateInspectionStore = InputStateInspection & {
	subscribe: (listener: () => void) => () => void;
	getRevision: () => number;
};

function createInputStateInspectionStore(): InputStateInspectionStore {
	const readers = new Map<string, InputStateReader>();
	const listeners = new Set<() => void>();
	let revision = 0;

	const notify = () => {
		revision += 1;
		listeners.forEach((listener) => {
			listener();
		});
	};

	return {
		registerInputState(id, reader) {
			readers.set(id, reader);
			notify();
			return () => {
				if (readers.get(id) !== reader) return;
				readers.delete(id);
				notify();
			};
		},
		read: (id) => readers.get(id)?.(),
		entries: () => [...readers.keys()],
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		getRevision: () => revision,
	};
}

const InputStateInspectionContext = createContext<InputStateInspectionStore | null>(null);

export interface InputStateInspectionProviderProps {
	children: ReactNode;
}

export function InputStateInspectionProvider({
	children,
}: InputStateInspectionProviderProps) {
	const store = useMemo(createInputStateInspectionStore, []);
	return createElement(
		InputStateInspectionContext.Provider,
		{ value: store },
		children,
	);
}

export function useInputStateInspection(): InputStateInspection | undefined {
	const store = useContext(InputStateInspectionContext);
	const noopSubscribe = () => () => undefined;
	const noopSnapshot = () => 0;
	useSyncExternalStore(
		store?.subscribe ?? noopSubscribe,
		store?.getRevision ?? noopSnapshot,
		store?.getRevision ?? noopSnapshot,
	);
	return store ?? undefined;
}
