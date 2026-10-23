# Dolmen API 개발 관측 계약

기존 `/api/health`, `/api/documents`, `/api/chat`과 이력서 개인정보 제외 정책을 유지한다.
개발용 데이터·실행 관측은 서버의 `DOLMEN_DEBUG_ENABLED=true`일 때만 제공하며 기본값은 `false`다.
운영에서는 활성화하지 않는다. 클라이언트가 플래그를 지정하거나 쿼리로 우회할 수 없다.

## 등록 데이터 상태

`GET /api/documents`는 기존 `revision`, `sources`, `resume_configured`, `resume_ready`,
`section_count`, `candidate_name`, `resume_updated_at`을 유지한다. 개발 설정이 활성화되면 다음
`debug` 객체를 추가한다. 등록·추출·색인 실패는 기존 HTTP 503 오류 계약을 사용한다.

| 필드 | 의미 |
| --- | --- |
| `page_count` | 현재 등록본의 정제된 쪽 수 |
| `sanitized_character_count` | 정제된 쪽 본문의 문자 수 합계. 토큰 수가 아니다. |
| `embedding_model` | 실제 검색기에서 사용하는 임베딩 모델 식별자 |
| `retrieval_limit` | 실제 검색 상한 설정 |
| `context_policy` | `full_sanitized_resume`: 정제된 전체 쪽 문맥을 사용 |
| `privacy_filter_version`, `index_version` | 현재 정제·색인 구현 버전 |
| `model_id` | `LLM_MODEL_ID`의 안전한 모델 식별자만 표시. 위험 문자·긴 값은 빈 문자열. |
| `history_turn_limit`, `session_limit` | 실제 에이전트 대화 보관 상한 설정 |
| `sections` | 현재 활성 정제 절의 `{document_id, source, version, character_count, snippet}` 목록 |

절 정보는 등록본과 같은 잠금 안의 활성 snapshot에서 읽는다. `snippet`은 기존 근거와 같은
정제 본문 앞 220자 이하다. 전체 추출 원문이나 원본 PDF를 다운로드하는 API는 제공하지 않는다.
개발 메타데이터 수집이 실패하면 `debug`를 생략하며 본래 등록 상태를 변경하지 않는다.
새 필드에는 `null`을 사용하지 않는다.

## 채팅 실행 이벤트

`POST /api/chat` 요청과 `sources`, `status`, `chunk`, `done`, `error` 이벤트의 필드는 유지한다.
개발 설정이 활성화되면 SSE의 JSON 데이터에 다음 형태를 추가한다.

```json
{"type":"debug","event":"context_ready","elapsed_ms":12.3,"request_id":"b0bb2808-78a6-463c-9646-c8c0672ce784","details":{"revision":9,"page_count":2,"context_characters":1800,"retrieved_count":2,"retrieval_limit":5}}
```

`request_id`는 요청마다 새 UUID를 사용한다. 세션 식별자는 보내지 않는다. `elapsed_ms`는 해당
요청의 서버 처리 관측 시작부터 경과한 실제 밀리초이며 음수가 아니고 감소하지 않는다.
내부 사고·추론·계획을 표시하는 이벤트가 아니다.
`context_characters`는 전달하는 정제된 전체 이력서 쪽 본문의 문자 합계이며 시스템 프롬프트,
질문, 이전 대화, JSON 포장, 중복 검색 조각은 포함하지 않는다. 전체 모델 입력 크기나 토큰 수가 아니다.

| `event` | 허용된 `details` |
| --- | --- |
| `request_received` | 빈 객체 |
| `retrieval_started` | `retrieval_limit` |
| `context_ready` | `revision`, `page_count`, `context_characters`, `retrieved_count`, `retrieval_limit` |
| `reply_attempt` | `attempt`(1부터), `answer_path` |
| `retry_scheduled` | `attempt`, `next_attempt`, `backoff_seconds`, 안전한 오류 메타데이터 |
| `first_chunk` | `attempt`, `answer_path`, `chunk_characters` |
| `reply_completed` | `attempts`, `answer_path`, `reply_characters` |
| `reply_failed` | `stage`, `attempt`(시도 전 0), `reason`, 선택적 `answer_path`, 안전한 오류 메타데이터 |

`answer_path`는 실제 정책과 공유하는 `model`, `private_refusal`, `no_evidence` 중 하나다.
`model`은 모델 경로의 응답 시도를 뜻하며 제공자가 요청을 수락했다는 확인이 아니다.
개인정보 거절과 근거 없음의 로컬 응답을 모델 호출로 표시하지 않는다.

정상 순서는 `request_received → retrieval_started → context_ready → sources(있을 때) →
reply_attempt → first_chunk → chunk… → reply_completed → done`이다. 재시도는 실제 재시도
분기에서만 `retry_scheduled → status → 대기 → reply_attempt`를 추가한다. 첫 답변 조각 뒤에는
재시도하지 않는다. 실패는 `reply_failed → error`로 끝나고 빈 응답을 완료로 표시하지 않는다.
`first_chunk`는 요청당 최대 한 번이며, `done` 또는 `error` 뒤에는 개발 이벤트를 내보내지 않는다.

`stage`는 `retrieval`, `configuration`, `reply`다. `reason`은 `resume_not_configured`,
`resume_not_ready`, `llm_not_configured`, `model_initialization_failed`, `empty_reply`,
`reply_error` 중 하나다. 안전한 오류 메타데이터는 다음 필드만 사용한다.

- `error_category`: `rate_limit`, `overloaded`, `timeout`, `authentication`, `connection`,
  `provider_error`, `unknown` 중 하나. 확인된 정보가 없으면 `unknown`.
- `provider_code`: 확인 가능한 숫자 코드만 선택적으로 표시(0~999999).
- `http_status`: 확인 가능한 HTTP 상태만 선택적으로 표시(100~599).

키·Base URL·절대 경로·원본 PDF·질문·다른 세션의 대화·원문 예외·헤더·응답 본문·숨은 추론은
개발 데이터에 넣지 않는다. 토큰 사용량을 추정해서 제공하지 않는다. 계측 생성·출력 오류는 격리하여
답변 텍스트나 기존 종료 이벤트를 바꾸지 않는다.

## 검증

```bash
uv run --no-sync python -m unittest discover -s tests -q
uv run --no-sync ruff check app tests
uv lock --check
```

테스트는 합성 자료와 가짜 검색·모델을 사용하며 실제 이력서 본문을 fixture로 저장하지 않는다.
