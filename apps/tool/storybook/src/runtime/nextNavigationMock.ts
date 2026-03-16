import { useSyncExternalStore } from "react";

const NAVIGATION_EVENT = "storybook:next-navigation";

function getSnapshot(): URL {
	if (typeof window === "undefined") {
		return new URL("http://localhost/");
	}

	return new URL(window.location.href);
}

function subscribe(onStoreChange: () => void) {
	if (typeof window === "undefined") {
		return () => undefined;
	}

	const handleChange = () => {
		onStoreChange();
	};

	window.addEventListener("popstate", handleChange);
	window.addEventListener(NAVIGATION_EVENT, handleChange);

	return () => {
		window.removeEventListener("popstate", handleChange);
		window.removeEventListener(NAVIGATION_EVENT, handleChange);
	};
}

function emitNavigation(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

function navigate(href: string, replace = false): void {
	if (typeof window === "undefined") {
		return;
	}

	const nextUrl = new URL(href, window.location.href);
	if (replace) {
		window.history.replaceState({}, "", nextUrl);
	} else {
		window.history.pushState({}, "", nextUrl);
	}

	emitNavigation();
}

function useLocationSnapshot(): URL {
	return useSyncExternalStore(
		subscribe,
		getSnapshot,
		() => new URL("http://localhost/"),
	);
}

export function useRouter() {
	return {
		push: (href: string) => navigate(href),
		replace: (href: string) => navigate(href, true),
		back: () => window.history.back(),
		forward: () => window.history.forward(),
		refresh: () => emitNavigation(),
		prefetch: async () => undefined,
	};
}

export function usePathname(): string {
	return useLocationSnapshot().pathname;
}

export function useSearchParams(): URLSearchParams {
	return useLocationSnapshot().searchParams;
}

export function redirect(href: string): never {
	navigate(href);
	throw new Error(`NEXT_REDIRECT:${href}`);
}

export function notFound(): never {
	throw new Error("next/navigation notFound() is not supported in Storybook.");
}
