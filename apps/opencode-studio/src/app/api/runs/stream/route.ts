import { runManager } from "@/lib/run-manager";

export const runtime = "nodejs";

function toSseChunk(data: unknown) {
	return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET() {
	const encoder = new TextEncoder();
	let unsubscribe: (() => void) | undefined;
	let heartbeat: NodeJS.Timeout | undefined;

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(
				encoder.encode(
					toSseChunk({
						type: "snapshot",
						runs: runManager.listRuns(),
					}),
				),
			);

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
