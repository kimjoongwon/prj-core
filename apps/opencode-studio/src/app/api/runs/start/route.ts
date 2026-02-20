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

	return Response.json(
		{
			error:
				"This endpoint is disabled. opencode-studio now monitors terminal sessions only.",
			prompt,
		},
		{ status: 410 },
	);
}
