import { runManager } from "@/lib/run-manager";

export const runtime = "nodejs";

interface StartBody {
	prompt?: string;
}

export async function POST(request: Request) {
	const body = (await request.json()) as StartBody;
	const prompt = body.prompt?.trim();

	if (!prompt) {
		return Response.json({ error: "Prompt is required" }, { status: 400 });
	}

	const run = runManager.createRun(prompt);
	return Response.json({ run });
}
