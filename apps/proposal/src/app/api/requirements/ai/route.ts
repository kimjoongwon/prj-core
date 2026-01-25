import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
	question: string;
	systemPrompt: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: RequestBody = await request.json();
		const { question, systemPrompt } = body;

		if (!question || !systemPrompt) {
			return NextResponse.json(
				{ error: "question과 systemPrompt가 필요합니다" },
				{ status: 400 },
			);
		}

		// API 키가 없으면 Mock 응답 반환
		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json({
				answer: getMockResponse(question),
			});
		}

		// OpenAI API 호출
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			max_tokens: 1024,
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: question,
				},
			],
		});

		// 텍스트 응답 추출
		const answer =
			completion.choices[0]?.message?.content || "응답을 생성할 수 없습니다.";

		return NextResponse.json({ answer });
	} catch (error) {
		console.error("AI API 오류:", error);

		// OpenAI API 에러 상세 정보 추출
		let errorMessage = "AI 처리 중 오류 발생";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json(
			{
				error: errorMessage,
				details:
					process.env.NODE_ENV === "development"
						? JSON.stringify(error, null, 2)
						: undefined,
			},
			{ status: 500 },
		);
	}
}

/**
 * Mock 응답 생성 (API 키 없을 때)
 */
function getMockResponse(question: string): string {
	const questionLower = question.toLowerCase();

	if (questionLower.includes("user") && questionLower.includes("영향")) {
		return `**User 엔티티 수정 시 영향 분석**

영향받는 화면 목록:
1. **회원 목록 화면** (L4-SCR-001)
   - 경로: /users
   - 이유: GET /api/users API를 통해 User 엔티티 조회

2. **회원 상세 화면** (L4-SCR-002)
   - 경로: /users/:id
   - 이유: GET /api/users/:id API를 통해 User 엔티티 조회

3. **회원 수정 화면** (L4-SCR-004)
   - 경로: /users/:id/edit
   - 이유: PUT /api/users/:id API를 통해 User 엔티티 수정

총 3개 화면이 영향을 받습니다.`;
	}

	if (questionLower.includes("목록") && questionLower.includes("api")) {
		return `**회원 목록 화면 (L4-SCR-001)이 호출하는 API**

- **GET /api/users** (L6-API-001)
  - 설명: 회원 목록 조회 API
  - 관계 타입: calls (호출)

이 API는 User 엔티티를 조회하여 페이징된 회원 목록을 반환합니다.`;
	}

	if (questionLower.includes("등록") && questionLower.includes("테스트")) {
		return `**회원 등록 기능 (L3-FTR-003) 관련 테스트**

- **이메일 중복 등록 실패** (L10-TST-002)
  - 설명: 중복 이메일로 등록 시 에러 발생 테스트
  - 관계 타입: tests

추가로 이메일 유효성 검사 로직 (L9-LOG-001)이 User.email 필드를 검증합니다.`;
	}

	return `질문을 분석 중입니다: "${question}"

현재 데모 모드로 실행 중입니다.
OPENAI_API_KEY 환경 변수를 설정하면 실제 GPT AI 응답을 받을 수 있습니다.

그래프에는 총 34개의 노드와 38개의 엣지가 있으며,
Level 0~10까지 계층적으로 구성되어 있습니다.`;
}
