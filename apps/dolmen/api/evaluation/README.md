# Dolmen 답변 평가 계약

이 문서는 평가 모듈, 개발 화면의 평가 계약과 합성 회귀 실행기의 기준이다. 실행 관측 이벤트 자체는
상위 [API README](../README.md)가 소유한다. 평가는 `DOLMEN_DEBUG_ENABLED=true`인 개발 서버에서만
노출하며 기본값은 `false`다. 운영에서는 켜지 않는다.

## 세 가지 다른 결과

1. **규칙 검사**는 빈 답변, 쪽 인용 유무, 실제 제공 쪽과의 일치, 지원자 호칭/1인칭 패턴,
   알려진 개인정보 패턴을 검사한다. 사실 관계, 경력 귀속, 의미적 정답을 증명하지 않는다.
2. **실행 수치**는 실제 요청 단계에서 관측한 TTFT, 종료 지연, 시도 수, 완료·복구 비율이다.
   입력 글자 수를 토큰 사용량으로 바꾸거나 관측되지 않은 값을 0으로 채우지 않는다.
3. **LLM Judge**는 `groundedness`, `relevance`, `completeness` 각각 1~5점과 짧은 판정 요약이다.
   모델의 의견이며 정답률이 아니다. 같은 제공자·같은 설정 모델을 사용하므로 자기 선호, 문체,
   길이 편향이 있을 수 있다. 사람의 근거 대조를 함께 수행한다.

[Hello Agents 12장](https://github.com/datawhalechina/hello-agents/blob/main/docs/chapter12/Chapter12-Agent-Performance-Evaluation.md)의
작업 데이터셋, 정확성/효율/복구의 구분, 다차원 Judge와 사람 검토를 Dolmen의 좁은 과제에 적용한다.
BFCL·GAIA 점수나 공개 벤치마크 성적으로 해석하지 않는다. 상대 Win Rate는 같은 데이터셋의 두 실행을
익명 A/B로 사람에게 제시하고 `wins / (wins + losses + ties)`와 동률 비율을 함께 기록할 때 의미가 있다.
현재 자동 Win Rate나 비교 우열 점수는 제공하지 않는다.

[9장](https://github.com/datawhalechina/hello-agents/blob/main/docs/chapter9/Chapter9-Context-Engineering.md)의
문맥 선택·예산 원칙에 따라, Judge도 같은 현재 등록본에서 `build_resume_context`를 호출해 선택한
정제 쪽을 사용한다. 검색 상위 조각 밖의 올바른 쪽 인용도 이 문맥에 포함된다. 질문·답변·문서는
비신뢰 자료이며 평가 프롬프트나 역할 변경 명령으로 실행하지 않는다.

## 완료 답변의 규칙 검사

`evaluate_answer(question, answer, grounds, candidate_name, status="completed", private_values=(),
resume_pages=None)`는 다음을 반환한다. `resume_pages`는 실제 모델에 제공한 선택 쪽이어야 한다.
검색 조각과 전체 쪽을 합친 실제 제공 범위에서 인용을 확인하며, 인용 번호의 일치만 판정한다.

```json
{"kind":"deterministic_checks","status":"completed","checks":[{"name":"citations_match","status":"passed","reason":"인용한 쪽이 실제 제공한 근거에 포함됩니다."}],"disclaimer":"규칙 검사는 인용·형식·개인정보 패턴 검사이며 답변의 정답률이 아닙니다."}
```

`checks`는 항상 `non_empty`, `citations_present`, `citations_match`, `third_person`,
`no_private_information` 순서다. 각 상태는 `passed | failed | skipped`다.
취소·오류·로컬 개인정보 거절·근거 없음 응답은 전체 `skipped`다. 개인정보 검사는 기존 정제기의
이메일/전화/주소/주민번호/일부 인적사항 패턴과 명시한 알려진 비공개 값만 탐지한다. 완전 탐지가 아니다.

서버는 개발 모드의 정상 모델 응답 완료 전에 같은 요청 UUID의
`{type:"debug", event:"answer_evaluated", elapsed_ms, request_id, details:{}, evaluation}`을 추가한다.
평가 본문에 질문, 답변, 이력서 원문, 세션 식별자나 내부 추론은 넣지 않는다.

## 선택적 Judge HTTP 계약

명시적인 평가 버튼 또는 오프라인 `--judge`로만 실행한다. 자동 채점이나 자동 재시도는 없다.

`POST /api/evaluations/judge`의 JSON 본문:

| 필드 | 한도/의미 |
| --- | --- |
| `question` | 1~4000자, 질문 자료 |
| `answer` | 1~12000자, 화면에서 완료된 답변 자료 |
| `status` | `completed | failed | cancelled` |
| `resume_revision` | 0 이상의 정수, 답변 생성 때 관측한 등록본 버전 |
| `ground_chunk_ids` | 실제 sources ID, 5개 이하, ID당 1~160자 |

입력 상태와 답변은 클라이언트가 제공하는 비신뢰 주장이다. 서버가 원래 응답을 보관하거나 서명하지
않으므로 **서버가 생성한 답변임을 증명하는 API가 아니다.** 현재 RAG 검색과 GSSC 쪽 선택에는
생성 때와 같은 원질문을 그대로 사용하며, revision과 중복 없는 ID 집합이 정확히 일치하는지 검증한다.
질문 정제가 공백/문자 수와 예산을 바꿔 원래 제외된 쪽을 추가하지 않도록 정제는 이 재구성 이후
Judge payload에만 적용한다. 같은 문맥 정책·예산에서 이력은 이력서 쪽보다 먼저 제외되므로 이력이
없는 재구성도 같은 이력서 쪽을 선택한다. 서버 설정/정책이 바뀐 과거 실행을 서명으로 증명하는 기능은
제공하지 않는다. 변경/위조 근거는 평가하지 않는다. 현재 전체 정제 쪽에서 선택한 쪽과 근거만 Judge에
제공하며, 다른 세션의
대화·원본 PDF·파일 경로·키·Base URL·원래 요청 trace는 제공하지 않는다. 조회 중 등록본이 바뀌면
다음 평가에서 일치 검증이 실패한다. 평가 시점의 정제 snapshot을 평가하며 현재도 같은 등록본이라는
장기 보장을 뜻하지 않는다.

```json
{"kind":"llm_judge","status":"completed","scores":{"groundedness":4,"relevance":5,"completeness":3},"reasons":{"groundedness":"기술 근거가 있습니다.","relevance":"질문에 답합니다.","completeness":"역할 설명이 빠졌습니다."},"reason":"completed","disclaimer":"평가 모델의 의견이며 사실 확인이나 정답률이 아닙니다. 답변과 같은 모델을 사용하므로 편향될 수 있으며 사람의 검토가 필요합니다.","model_id":"configured-safe-model-id"}
```

`status`는 `completed | skipped | failed`다. 실패·생략 시 `scores`, `reasons`는 모두 `null`이며
부분 점수를 만들지 않는다. `model_id`는 안전한 환경설정 모델 식별자이며 평가 전 종료는 빈 문자열이다.
차원별 이유는 strict JSON의 240자 이하 판정 요약만 허용하고 개인정보 정제를 다시 적용한다.
`reasoning_content`, 사고 과정, 원문 응답 객체는 읽거나 내보내지 않는다. JSON/범위/차원 누락/추가
필드가 잘못되면 `failed/invalid_judge_output`이며 원래 모델 출력은 반환하지 않는다.

고정 `reason`은 `completed`, `non_completed_answer`, `private_question`, `no_evidence`,
`sanitized_empty`, `context_mismatch`, `context_budget_exceeded`, `content_too_long`,
`input_budget_exceeded`, `unsupported_provider`, `invalid_judge_output`, `timeout`,
`provider_error`, `evaluation_unavailable` 중 하나다. 12000자 초과 답변은 요청 전 UI에서 평가 불가로
표시하며 서버도 422로 거절한다. 서버가 입력을 잘라서 점수를 내지 않는다.

SDK timeout과 전체 비동기 요청 deadline은 각각 15초, `max_retries=0`, 출력 상한은 700 tokens다.
[공식 Python SDK 문서](https://developers.openai.com/api/reference/python)의
timeout/재시도 계약과 설치된 SDK 구현을 확인했다. 기존 HelloAgents의 공개 설정을
재사용하는 OpenAI 호환 제공자만 지원하며 다른 제공자는 `unsupported_provider`다. 전체 근거는
16000자 이하이며 전체 쪽을 제공할 때 검색 조각 본문은 중복 전송하지 않고 출처만 포함한다.
system/JSON/질문/답변/근거와 메시지 포장을 합친 UTF-8 bytes는
`min(ContextSettings.input_token_limit, 65536)`
이하다(기본 32768 bytes). 앱의 입력 예산을 byte 상한으로 보수적으로 준용한다. 한도 초과는
입력 불가로 표시한다. 이 byte 수를 실제 토큰 사용량으로 보고하지 않는다. HTTP 연결이 취소되어도
이미 시작한 제공자 요청은 SDK timeout까지 진행될 수 있다. 평가 요청/응답을 서버에 저장하지 않는다.

HTTP 오류는 `{detail:{code,message}}`의 고정 안내만 반환한다. 비활성은 본문 해석 전 404
`not_found`, 요청 형식/필드 위반은 422 `invalid_request`, 본문 64000 bytes 초과는 413
`request_too_large`다. 검색·모델 준비 오류는 HTTP 200의 `failed/evaluation_unavailable`이며
원문 예외나 validation input을 반사하지 않는다.

## 합성 회귀 실행

```bash
uv run --no-sync python scripts/evaluate.py --mode deterministic --output /tmp/dolmen-fixture-evaluation.json
uv run --no-sync python scripts/evaluate.py --mode provider --output /tmp/dolmen-provider-evaluation.json
uv run --no-sync python scripts/evaluate.py --mode provider --judge --max-cases 1 --output /tmp/dolmen-judge-evaluation.json
```

`synthetic_tasks.json`의 가상 회사·이력서·가짜 연락처만 사용한다. 실제 등록 이력서 경로를 읽지 않는다.
실제 PDF 생성 → 기존 PDF 추출/개인정보 정제 → 임시 RAGStore → 등록본 검색 → `/api/chat` SSE →
`DolmenAgentService`와 `SimpleAgent` → 규칙 검사 경로를 재사용한다.

`deterministic`은 검색 백엔드와 LLM 응답만 고정 대역으로 바꾼 **계약 회귀**다. prompt와 응답 전달,
정제·로컬 거절·예산 경계의 연결을 검증하지만 모델의 지시 준수나 의미 이해를 검증하지 않는다.
`provider`는 실제 FastEmbed/Qdrant와 설정 모델을 사용한다. 네트워크/임베딩 캐시가 필요하며 제공자
비용과 지연이 발생한다. `--judge`는 이 모드에서만 허용한다.

회사 귀속, 미기재 사실, 개인정보 거절, 긴 대화, 입력 예산 초과, 질문/문서 지시 주입을 기록한다.
`response`, 기계적 기대조건의 `failures`, 규칙 결과, 실측 지연/TTFT/시도/완료/복구 수치가 JSON에
남는다. 일반 SSE trace UUID·세션 ID·전체 이력서·provider 원문 예외는 결과에서 제외한다.
긴 대화의 준비 요청도 실행 집계에 포함한다. 기본 최대 16개 HTTP 요청이며 `--max-requests`로
줄일 수 있다. 이 한도는 채팅의 제공자 재시도나 SDK 내부 재시도까지 포함한 과금 상한이 아니다.
제공자 응답은 매번 달라질 수 있고, 문구 조건 충족만으로 의미적 정답이나 정답률을 주장하지 않는다.

집계에서 완료율은 완료/관측요청, 복구율은 재시도 후 완료/재시도 요청이다. 분모가 없으면 `null`이다.
시도는 실제 `reply_attempt` 개수, TTFT는 최초 `first_chunk`, 종료 지연은 완료/오류/취소의 실제 경과
밀리초다. p50/p95는 관측값의 nearest-rank이며 없는 측정은 생략한 표본 수와 `null`로 구분한다.

사람은 provider 결과의 질문, 답변, 가상 원본의 회사/프로젝트/기술 경계, 작성 기준일, 미기재 안내와
개인정보 거절을 대조하고 `human_review: pending`을 별도 검토 기록에서 승인/수정 필요로 판정한다.
모델 의견과 사람이 검증한 사실을 같은 점수로 합치지 않는다.
