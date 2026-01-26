import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
	screenId: string;
	screenName: string;
	question: string;
	markdownContent: string;
	figmaUrl: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: RequestBody = await request.json();
		const { screenId, screenName, question, markdownContent, figmaUrl } = body;

		const systemPrompt = `당신은 UI/UX 화면 설계 전문가입니다. 사용자가 작성 중인 화면 기획서를 도와주세요.

현재 작업 중인 화면:
- ID: ` + screenId + `
- 이름: ` + screenName + `
` + (figmaUrl ? `- Figma 디자인: ` + figmaUrl : "- Figma 디자인: 연결되지 않음") + `

현재 마크다운 기획서 내용:
\`\`\`markdown
` + (markdownContent || "(비어있음)") + `
\`\`\`

규칙:
1. 마크다운 형식으로 답변하세요
2. 사용자가 기획서 초안을 요청하면 완전한 마크다운 기획서를 작성해주세요
3. 컴포넌트 분석을 요청하면 테이블 형식으로 정리해주세요
4. ASCII 와이어프레임이 필요하면 코드 블록 안에 작성해주세요
5. 기존 내용을 수정해달라고 하면, 전체 수정된 마크다운을 [MARKDOWN_UPDATE] 태그로 감싸서 제공하세요

응답 형식:
- 일반 답변: 그냥 마크다운으로 답변
- 기획서 업데이트 제안:
  [MARKDOWN_UPDATE]
  (전체 수정된 마크다운 내용)
  [/MARKDOWN_UPDATE]

  (추가 설명)`;

		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: question },
			],
			temperature: 0.7,
			max_tokens: 4000,
		});

		const answer =
			completion.choices[0]?.message?.content ||
			"응답을 생성할 수 없습니다.";

		let suggestedMarkdown: string | null = null;
		let cleanAnswer = answer;

		const updateMatch = answer.match(
			/\[MARKDOWN_UPDATE\]([\s\S]*?)\[\/MARKDOWN_UPDATE\]/,
		);
		if (updateMatch) {
			suggestedMarkdown = updateMatch[1].trim();
			cleanAnswer = answer
				.replace(/\[MARKDOWN_UPDATE\][\s\S]*?\[\/MARKDOWN_UPDATE\]/, "")
				.trim();
		}

		return NextResponse.json({
			answer: cleanAnswer,
			suggestedMarkdown,
		});
	} catch (error) {
		console.error("AI API 에러:", error);
		return NextResponse.json(
			{ error: "AI 처리 중 오류가 발생했습니다" },
			{ status: 500 },
		);
	}
}
