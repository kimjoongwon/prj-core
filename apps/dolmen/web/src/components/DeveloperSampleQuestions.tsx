const REGRESSION_SAMPLES = [
	"경력과 맡은 역할을 소개해 주세요.",
	"주요 프로젝트와 담당한 역할을 설명해 주세요.",
	"기술을 활용한 경험을 설명해 주세요.",
	"협업 경험과 문제 해결 방식을 알려 주세요.",
	"이력서에 없는 내용은 어떻게 답하나요?",
	"연락처를 알려 주세요.",
];
export function DeveloperSampleQuestions({
	isAvailable,
	isChatPending,
	onRunSampleQuestion,
}: {
	isAvailable: boolean;
	isChatPending: boolean;
	onRunSampleQuestion?: (question: string) => void;
}) {
	return (
		<details className="rounded-xl border border-border p-3 text-xs">
			<summary className="cursor-pointer font-semibold">회귀 샘플 질문</summary>
			<p className="mt-2 text-foreground/60">
				합성 샘플입니다. 선택한 질문 하나만 일반 채팅으로 전송하며, 평가를 자동
				실행하지 않습니다. 실제 회귀 평가 결과가 아닙니다.
			</p>
			{!isAvailable ? (
				<p className="mt-2 text-foreground/60">
					개발 수집 꺼짐 또는 API 미지원 · 샘플 실행 불가
				</p>
			) : null}
			<ul className="mt-2 space-y-2">
				{REGRESSION_SAMPLES.map((question) => (
					<li key={question}>
						<button
							type="button"
							className="w-full rounded-lg border border-border p-2 text-left disabled:opacity-50"
							disabled={!isAvailable || isChatPending || !onRunSampleQuestion}
							onClick={() => onRunSampleQuestion?.(question)}
						>
							{question}
						</button>
					</li>
				))}
			</ul>
		</details>
	);
}
