interface StorybookMswContextLike {
	parameters?: {
		msw?: {
			handlers?: readonly unknown[];
		};
	};
}

type WorkerLike = {
	resetHandlers: () => void;
	start: (options?: {
		onUnhandledRequest?: "bypass" | "error" | "warn";
	}) => Promise<void>;
	use: (...handlers: unknown[]) => void;
};

let worker: WorkerLike | undefined;
let startPromise: Promise<void> | undefined;

function getPlanningHandlers(context: StorybookMswContextLike): unknown[] {
	const mswHandlers = context.parameters?.msw?.handlers;

	if (Array.isArray(mswHandlers) && mswHandlers.length > 0) {
		return [...mswHandlers];
	}

	return [];
}

async function getWorker(): Promise<WorkerLike | undefined> {
	if (typeof window === "undefined") {
		return undefined;
	}

	if (!worker) {
		const { setupWorker } = await import("msw/browser");
		worker = setupWorker() as WorkerLike;
	}

	return worker;
}

async function startWorker(): Promise<WorkerLike | undefined> {
	const nextWorker = await getWorker();

	if (!nextWorker) {
		return undefined;
	}

	if (!startPromise) {
		startPromise = nextWorker.start({ onUnhandledRequest: "bypass" });
	}

	await startPromise;
	return nextWorker;
}

export async function withStorybookMswLoader(context: StorybookMswContextLike) {
	const nextWorker = await startWorker();

	if (!nextWorker) {
		return {};
	}

	const handlers = getPlanningHandlers(context);
	nextWorker.resetHandlers();

	if (handlers.length > 0) {
		nextWorker.use(...handlers);
	}

	return {
		storybookMsw: {
			handlerCount: handlers.length,
		},
	};
}
