import { runManager } from "@/lib/run-manager";

export const runtime = "nodejs";

function toSseChunk(data: unknown) {
	return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
	const encoder = new TextEncoder();
	let unsubscribe: (() => void) | undefined;
	let heartbeat: NodeJS.Timeout | undefined;
	let snapshotPoller: NodeJS.Timeout | undefined;
	let lastDigest = "";

	const createSnapshot = () => ({
		type: "snapshot",
		runs: runManager.listRuns(),
		terminals: runManager.listTerminals(),
		availableSubagents: runManager.listAvailableSubagents(),
	});

	const createDigest = () => {
		const snapshot = createSnapshot();
		const runDigest = snapshot.runs
			.map((run) => `${run.id}:${run.updatedAt}:${run.events.length}`)
			.join("|");
		return `${snapshot.terminals.join(",")}#${snapshot.availableSubagents.join(",")}#${runDigest}`;
	};

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(encoder.encode(toSseChunk(createSnapshot())));
			lastDigest = createDigest();

			snapshotPoller = setInterval(() => {
				const nextDigest = createDigest();
				if (nextDigest === lastDigest) {
					return;
				}

				lastDigest = nextDigest;
				controller.enqueue(encoder.encode(toSseChunk(createSnapshot())));
			}, 900);

			unsubscribe = runManager.onEvent((event) => {
				controller.enqueue(
					encoder.encode(
						toSseChunk({
							type: "event",
							event,
						}),
					),
				);
			});

			heartbeat = setInterval(() => {
				controller.enqueue(encoder.encode(": heartbeat\n\n"));
			}, 12000);
		},
		cancel() {
			if (heartbeat) {
				clearInterval(heartbeat);
			}
			if (snapshotPoller) {
				clearInterval(snapshotPoller);
			}
			if (unsubscribe) {
				unsubscribe();
			}
			return;
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
		},
	});
}
