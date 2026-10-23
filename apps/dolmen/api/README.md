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
| `reply_metrics` | `attempt`, `run_status`, 선택적 `stop_reason`, 실제 보고된 `prompt_tokens/completion_tokens/total_tokens` |
| `reply_failed` | `stage`, `attempt`(시도 전 0), `reason`, 선택적 `answer_path`, 안전한 오류 메타데이터 |

`answer_path`는 실제 정책과 공유하는 `model`, `private_refusal`, `no_evidence` 중 하나다.
`model`은 모델 경로의 응답 시도를 뜻하며 제공자가 요청을 수락했다는 확인이 아니다.
개인정보 거절과 근거 없음의 로컬 응답을 모델 호출로 표시하지 않는다.

정상 순서는 `request_received → retrieval_started → context_ready → sources(있을 때)` 이후
아래 GSSC/평가 순서를 따른다. 재시도는 실제 재시도
분기에서만 `retry_scheduled → status → 대기 → reply_attempt`를 추가한다. 첫 답변 조각 뒤에는
재시도하지 않는다. 실패는 `reply_failed → answer_evaluated(skipped, 수집 시) → error`로 끝나고 빈 응답을 완료로 표시하지 않는다.
`first_chunk`는 요청당 최대 한 번이며, `done` 또는 `error` 뒤에는 개발 이벤트를 내보내지 않는다.

`stage`는 `retrieval`, `configuration`, `context`, `reply`다. `reason`은 `resume_not_configured`,
`resume_not_ready`, `llm_not_configured`, `model_initialization_failed`, `empty_reply`,
`reply_error`, `context_budget_exceeded`, `output_limit`, `incomplete_reply` 중 하나다. 안전한 오류 메타데이터는 다음 필드만 사용한다.

- `error_category`: `rate_limit`, `overloaded`, `timeout`, `authentication`, `connection`,
  `provider_error`, `unknown` 중 하나. 확인된 정보가 없으면 `unknown`.
- `provider_code`: 확인 가능한 숫자 코드만 선택적으로 표시(0~999999).
- `http_status`: 확인 가능한 HTTP 상태만 선택적으로 표시(100~599).

키·Base URL·절대 경로·원본 PDF·질문·다른 세션의 대화·원문 예외·헤더·응답 본문·숨은 추론은
개발 데이터에 넣지 않는다. 입력 추정 예산과 실제 토큰 사용량은 구분한다. 요청별 공개 결과에서 확인된 사용량만 아래 계약으로 제공한다. 계측 생성·출력 오류는 격리하여
답변 텍스트나 기존 종료 이벤트를 바꾸지 않는다.

## 검증

```bash
uv run --no-sync python -m unittest discover -s tests -q
uv run --no-sync ruff check app tests
uv lock --check
```

테스트는 합성 자료와 가짜 검색·모델을 사용하며 실제 이력서 본문을 fixture로 저장하지 않는다.

## GSSC 입력 구성과 앱 예산

`app/context.py`의 builder는 수집(Gather)·선택(Select)·구조화(Structure)·압축(Compress)을
결정적으로 수행한다. 시스템 정책과 현재 질문은 우선 보존한다. 작은 정제 이력서는 모든 쪽을
원래 순서로 유지하여 회사·프로젝트·기술 귀속 문맥을 보존한다. 검색 본문은 반복 주입하지 않고
실제로 포함된 근거의 ID·version·쪽 위치만 별도로 남긴다. 같은 쪽이라도 선택된 회사 그룹의
본문에 포함되지 않은 검색 조각은 제공 근거에서 제외한다. `sources`는 검색 결과를 보여 주며,
실제 모델 입력 선택 여부는 `context_built`에서 확인한다.

이전 대화는 질문과 답변이 모두 있는 전체 턴만 사용한다. 과거 user JSON에 반복 저장된
이력서는 제거하고 질문만 남기며, 동일 턴은 최신 것을 보존하고 최대 최근 2턴을 유지한다.
모델 iterator가 정상 소진되고 비공백 답변을 완료한 턴만 보관한다. 오류·빈 답변·연결 취소는
SDK의 iterator 정리가 끝난 뒤 이번 질문의 예산 선택 전 정상 기록으로 되돌린다. 예산 때문에
이번 입력에서 제외한 이전 정상 턴도 실패·취소 시에는 잃지 않으며 중단된 synthetic 턴은 제거한다.
입력이 넘치면 오래된 전체 턴부터 제외한다. 그래도 부족하면 `회사명:`, `회사:`, `근무처:`처럼
명시적인 회사 헤더의 전체 그룹만 질문·검색 관련도 순으로 선택한다. 경계가 불명확한 이력서는
전체를 한 그룹으로 취급한다. 회사 기록 중간을 접두 길이로 자르지 않는다. 온전한 그룹을
하나도 넣지 못하면 `context_budget_exceeded` 오류로 종료하며 모델을 호출하지 않는다.

- `DOLMEN_CONTEXT_INPUT_TOKEN_LIMIT=32768`: 출력 예약분을 이미 제외한 **앱 입력 예산**.
- `DOLMEN_CONTEXT_OUTPUT_TOKEN_RESERVE=2048`: 실제 모델 요청의 `max_tokens`에 적용하는 출력 상한.
- 두 값은 공급자 모델의 context window를 확인한 값이 아니다. 모델에 맞게 별도로 설정한다.
- 입력 추정은 SDK에 전달할 실제 system/history/user 메시지 배열을 JSON 직렬화한 UTF-8 byte
  길이(`utf8_bytes_upper_bound_v1`)를 보수적 상한으로 사용한다. 실제 tokenizer 사용량이 아니다.
  JSON 포장·현재 질문·시스템 정책·선택한 이전 대화·정제 자료를 모두 포함해 검사한다.
- `remaining_input_tokens`는 `max(0, input_limit - estimated_input_tokens)`이다. 온전한 자료를
  넣을 수 없는 실패는 최종 추정치가 예산 이하여도 `budget_exceeded`가 될 수 있다.

같은 등록본·세션에서는 최근 후속 질문을 유지한다. 등록본 revision 변경 시 이전 세션 전체를
초기화하고 진행 중인 이전 등록본 응답도 중단한다. 세션 최대 50개, 최근 전체 2턴 보관,
토큰 카운터 캐시 정리 정책을 유지한다.

## 컨텍스트 스냅샷과 규칙 평가 SSE

새 이벤트도 `DOLMEN_DEBUG_ENABLED=true`에서만 제공한다. 기존 `type: debug` envelope와 같은
요청 UUID·실측 경과시간을 사용하며 `details`는 항상 빈 객체다.

```json
{"type":"debug","event":"context_built","elapsed_ms":20.1,"request_id":"b0bb2808-78a6-463c-9646-c8c0672ce784","details":{},"context":{"version":"gssc-v1","revision":9,"status":"ready","policy":"full_sanitized_resume","estimator":"utf8_bytes_upper_bound_v1","budget":{"input_limit":32768,"output_reserve":2048,"estimated_input_tokens":12000,"remaining_input_tokens":20768},"stages":[{"stage":"gather","input_count":4,"output_count":4},{"stage":"select","input_count":4,"output_count":4},{"stage":"structure","input_count":4,"output_count":4},{"stage":"compress","input_count":4,"output_count":3}],"packets":[{"packet_id":"system","kind":"system","source":"시스템 정책","selected":true,"reason":"required_system","estimated_tokens":5000,"character_count":1800}],"history":{"available_turns":0,"selected_turns":0,"dropped_turns":0,"deduplicated_turns":0}}}
```

위 예시의 수치는 형식 설명용이다. `context`의 계약은 다음과 같다.

| 필드 | 값·의미 |
| --- | --- |
| `version`, `revision` | `gssc-v1`, 해당 요청 등록본 revision |
| `status` | `ready` 또는 `budget_exceeded` |
| `policy` | `full_sanitized_resume` 또는 `selected_resume_groups` |
| `estimator`, `budget` | 위의 앱 예산·추정 방법. 실제 토큰 사용량과 별개 |
| `stages` | 순서가 고정된 `gather/select/structure/compress`의 `input_count/output_count` |
| `packets` | `{packet_id, kind, source, selected, reason, estimated_tokens, character_count, snippet?}` |
| `history` | `available_turns/selected_turns/dropped_turns/deduplicated_turns` |

단계 count의 단위는 자료 packet 수다. 선택 단계는 예산·최근 턴 한도를 적용하며, 구조화는
역할/비신뢰 JSON의 구조를 만든다. 압축 단계의 count 감소는 검색 본문의 중복과 동일 대화 턴을
제거한 수다. 과거 이력서 본문을 질문만으로 바꾸는 압축은 packet 수를 바꾸지 않는다.
packet 추정치는 개별 본문 UTF-8 byte 길이이며, JSON·역할 포장까지 포함하는 전체 입력 추정치와
합계가 같지 않을 수 있다.

`kind`는 `system/query/resume/history/retrieval`이다. `packet_id`는 64자 이하의 고정 형식
`system`, `query`, `resume-group-N`, `history-turn-N`, `retrieval-N`이며,
`source`는 80자 이하의 `시스템 정책`, `현재 질문`, `최근 대화`, `검색 근거`, `등록 이력서 · N쪽`만
사용한다. `snippet`은 **정제 이력서** packet에만 최대 220자로 제공한다. 시스템·질문·과거 대화
원문이나 전체 프롬프트는 제공하지 않는다. 알 수 없는 필드·식별자·값은 허용 목록에서 제거하거나
해당 진단 이벤트를 생략한다.

`reason`은 다음 한정 enum이다.

- `required_system`, `required_query`: 필수 시스템 정책·현재 질문.
- `full_resume_retained`, `selected_resume_group`: 전체 자료 또는 온전한 회사 그룹 선택.
- `resume_group_budget`: 회사 그룹 또는 그 그룹 밖 검색 조각을 입력에서 제외.
- `recent_history`, `history_turn_limit`, `history_budget`: 최근 턴 선택·턴 한도·예산 제외.
- `duplicate_history`, `duplicate_resume_ground`: 동일 턴·쪽 문맥에 이미 있는 검색 본문 제거.

모델 경로 정상 순서는 `sources → context_built(ready) → reply_attempt(model) → first_chunk →
chunk… → answer_evaluated → reply_completed → done`이다. 스냅샷은 모델 호출 전에 전송한다.
예산 실패는 `context_built(budget_exceeded) → reply_failed(stage=context, attempt=0,
reason=context_budget_exceeded) → answer_evaluated(skipped) → error`이며 모델 시도는 0회다.
재시도마다 새 입력을 구성하고 `context_built`를 다시 제공한다. 개인정보 거절·근거 없음의 로컬
경로는 `context_built` 없이 고정 응답과 `answer_evaluated(skipped)`를 제공한다.

`answer_evaluated`는 `evaluation` 객체를 추가한다. `kind=deterministic_checks`,
`status=completed|skipped`, `checks=[{name,status,reason}]`, `disclaimer` 형태다.
`name`은 `non_empty/citations_present/citations_match/third_person/no_private_information`,
개별 `status`는 `passed/failed/skipped`다. 사유는 서버의 고정 문구만 사용한다. 실제 선택한
정제 쪽과 검색 근거를 기준으로 인용을 검사한다. 정상 모델 답변만 검사하고 로컬 거절·근거 없음·
오류는 건너뛴다. 연결 취소 후에는 진단을 전송하지 않으며 평가하지 않는다. 규칙 검사는 인용·
형식·개인정보 패턴 검사이며 답변의 정답률을 뜻하지 않는다. 단순 패턴이므로 사람의 검토가 필요하다.

평가 생성·진단 생성·직렬화 오류는 답변/재시도/기존 종료 이벤트를 바꾸지 않는다.
`done` 또는 `error`는 요청마다 한 번이며, 그 뒤에는 추가 이벤트가 없다. 공유 LLM의 last_call_stats는 동시성·stale 값을 구분할 수 없어 읽지 않는다.
대신 아래 요청별 RunResult에서 확인된 usage만 제공한다. `first_chunk.elapsed_ms`는 수집한 경우
서버 관측 시작부터 첫 답변까지 실제 경과시간이며 공급자 token usage가 아니다.

## 선택적 모델 평가와 오프라인 평가

개발 설정에서만 `POST /api/evaluations/judge`를 수동 호출할 수 있다. 요청 필드는
`question`(1~4000자), `answer`(1~12000자), `status`(`completed/failed/cancelled`),
`resume_revision`(0 이상), `ground_chunk_ids`(현재 검색 결과와 일치하는 ID 최대 5개)다.
다른 revision·임의 근거를 거부하고 현재 정제 자료로 입력을 다시 구성한다. 키·주소·서버 경로는
응답에 포함하지 않는다. 비활성 상태는 404이며 검증 오류도 원문 입력을 반사하지 않는다.
모델 평가는 configured LLM의 같은 설정을 사용한다. groundedness/relevance/completeness
1~5점은 모델의 의견이며 정답률이 아니다. 같은 모델 평가의 편향이 있다. 평가 호출은 명시적으로
분리되어 일반 채팅을 지연하지 않는다. 오프라인 합성 평가의 실행법·데이터셋은
[evaluation/README.md](evaluation/README.md)를 참고한다.


## 출력 종료 경계와 요청별 사용량

모델 iterator가 정상 소진돼도 SDK의 `SimpleAgent.last_run.status=output_limit` 또는
`stop_reason=length|max_tokens|max_output_tokens`이면 잘린 답변이다. 공개 본문이 전혀 없는
경우도 `empty_reply` 대신 `output_limit`로 기록한다. 부분 본문이 이미 표시된 경우에도
`reply_failed(reason=output_limit) → answer_evaluated(skipped) → error`로 종료하며 `done`을
보내거나 자동 재시도하지 않는다. 질문 범위를 줄여 다시 요청할 수 있다. 실패 턴은 정상 대화에
저장하지 않는다. 다른 비정상 `RunResult.status`, 또는 `content_filter/tool_calls` 종료도
`incomplete_reply`로 처리한다. 실제 오류의 원인이 출력 상한인지 여부는 관측된 종료 사유로만
판정하며, 빈 본문이나 지연만 보고 추정하지 않는다. 기본 출력 예약값 2048은 그대로 유지한다.

개발 모드의 `reply_metrics`는 종료 결과가 생성된 시점, 기존 종료 이벤트 전에 추가된다.
같은 세션의 `last_run`이 호출 전과 다른 **이번 요청의 새 결과 객체**인 경우만 읽는다.
이 세션은 중복 실행을 차단하므로 다른 세션·이전 요청의 결과를 섞지 않는다.

- `attempt`: 이번 응답 시도 번호.
- `run_status`: `completed/output_limit/max_iterations/cancelled/budget_exhausted/failed/running/unknown`.
- `stop_reason`: 공급자가 보고한 경우만 `stop/length/max_tokens/max_output_tokens/tool_calls/content_filter/unknown`.
- `prompt_tokens`, `completion_tokens`, `total_tokens`: 이번 결과의 usage에 실제 존재하는
  0~1,000,000,000 범위 정수만 포함한다. 누락·잘못된 값은 미수집이며 0을 만들지 않는다.
  제공자가 보고한 사용량이며 UTF-8 byte 입력 추정치와 다르다. 재시도 간 합산값이 아니다.

정상 예시는 `chunk… → reply_metrics(run_status=completed) → answer_evaluated →
reply_completed → done`이다. 공급자 오류도 새 결과가 있으면 `reply_metrics(run_status=failed)`
이후 기존 재시도/오류 흐름을 따른다. 로컬 거절·근거 없음·입력 예산 실패는 실제 모델 결과가 없으므로
`reply_metrics`가 없다. 연결 취소 후에는 전송하지 않는다. 진단 생성에 실패하면 해당 이벤트만
생략하며 출력 상한 판정·정상/오류 종료·이력 복원은 계속 수행한다. 결과의 답변 본문·내부 추론·
원문 응답·임의 상태 문자열은 진단으로 직렬화하지 않는다.
