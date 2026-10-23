import type { DolmenResumeStatus } from "../data/dolmenHealthClient";

export function DeveloperDataPanel({
	resumeStatus,
}: {
	resumeStatus: DolmenResumeStatus | null;
}) {
	if (resumeStatus?.state !== "ready")
		return <p className="text-foreground/60">등록 데이터 상세 미확인</p>;
	const debug = resumeStatus.debug;
	const metadata = [
		["지원자", resumeStatus.candidateName],
		["이력서 기준일", resumeStatus.resumeUpdatedAt],
		["Revision", resumeStatus.revision],
		["등록 절 수", resumeStatus.sectionCount],
		["PDF 쪽 수", debug?.pageCount],
		["정제 본문 글자 수", debug?.sanitizedCharacterCount],
		["임베딩 모델", debug?.embeddingModel],
		["검색 개수 상한", debug?.retrievalLimit],
		["컨텍스트 정책", debug?.contextPolicy],
		["개인정보 필터 버전", debug?.privacyFilterVersion],
		["색인 버전", debug?.indexVersion],
		["답변 모델", debug?.modelId],
		["이전 대화 턴 상한", debug?.historyTurnLimit],
		["세션 상한", debug?.sessionLimit],
	] as const;
	return (
		<div className="min-w-0 space-y-3">
			{!debug ? (
				<p className="rounded-lg bg-default p-2 text-foreground/60">
					개발 데이터 미수신 · 수집 꺼짐 또는 API 미지원
				</p>
			) : null}
			<dl className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-x-2 gap-y-1.5">
				{metadata.map(([label, metadataValue]) => (
					<div key={label} className="contents">
						<dt className="text-foreground/60">{label}</dt>
						<dd className="min-w-0 break-words [overflow-wrap:anywhere]">
							{metadataValue === undefined || metadataValue === ""
								? "미확인"
								: metadataValue}
						</dd>
					</div>
				))}
			</dl>
			<details>
				<summary className="cursor-pointer">
					출처 목록 ({resumeStatus.sources.length})
				</summary>
				<ul className="mt-2 space-y-1 break-words [overflow-wrap:anywhere]">
					{resumeStatus.sources.map((source) => (
						<li key={source}>{source}</li>
					))}
				</ul>
			</details>
			<details>
				<summary className="cursor-pointer">
					전체 등록 절 목록 ({debug?.sections?.length ?? "미확인"})
				</summary>
				<p className="mt-2 text-foreground/60">
					각 절의 앞 220자 정제 발췌입니다.
				</p>
				{debug?.sections ? (
					<ol className="mt-2 space-y-2">
						{debug.sections.map((section) => (
							<li
								key={section.documentId}
								className="min-w-0 space-y-1 rounded-lg bg-background/60 p-2 break-words [overflow-wrap:anywhere]"
							>
								<p className="font-medium">{section.source}</p>
								<p>ID: {section.documentId}</p>
								<p>
									Version: {section.version} · {section.characterCount}자
								</p>
								<p className="whitespace-pre-wrap text-foreground/70">
									{section.snippet || "정제 발췌문 없음"}
								</p>
							</li>
						))}
					</ol>
				) : (
					<p className="mt-2 text-foreground/60">
						등록 절 상세 미확인 · 수집 꺼짐 또는 API 미지원
					</p>
				)}
			</details>
		</div>
	);
}
