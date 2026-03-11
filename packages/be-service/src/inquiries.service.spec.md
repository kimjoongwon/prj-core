# InquiriesService 기획서

> 생성일: 2026-03-01
> 타입: service
> 위치: packages/be-service/src/inquiries.service.ts

## 역할

문의 도메인의 핵심 비즈니스 로직을 담당합니다.

- 목록/상세 조회
- 생성/수정/삭제
- 상태 전이 검증
- 통계 집계
- thread/message/participant child write를 Inquiry root 기준으로 통제
- Create/Update Form Bootstrap 생성
- AiForm 요청 기반 patch 생성(`fillFormWithAi`)

## Form Bootstrap 메서드

### getCreateFormBootstrap()

- 반환 모드: `CREATE`
- `defaultObject`: `title`, `category`, `priority`, `content`, `channel`, `source`
- `options`: `category`, `priority`, `channel`, `source`
- `aiSchemas`: `inquiry-intake-basic` (`title`, `category`, `priority`, `content`)

### getUpdateFormBootstrap(inquiryId)

- 반환 모드: `UPDATE`
- `defaultObject`: `title`, `category`, `priority`, `content`, `channel`, `source`
- `ui.hiddenPaths`: `content`, `channel`, `source`
- `aiSchemas`: `inquiry-update-basic` (`title`, `category`, `priority`)

## AiForm 메서드

### fillFormWithAi(input)

- 입력: `mode`, `schemaKey`, `selectedPaths`, `currentObject`, `userPrompt`
- 검증:
  - `schemaKey` 유효성 검증
  - 선택 path가 schema/fieldMeta/ui 정책을 만족하는지 검증
- 생성 규칙(1차):
  - 텍스트 키워드 기반 `category`, `priority` 추천
  - `title`, `content` 보강
- 출력: `{ patches: [{ path, value }] }`

## 비즈니스 규칙

- `hidden > readOnly > disabled` 경로는 AI patch 대상에서 제외
- UPDATE 모드에서는 `content`를 AI 채움 대상에서 제외
- 허용되지 않은 path 요청은 `BadRequestException`
- 메시지 전송은 `InquiryThread`, `InquiryMessage`, `InquiryParticipant`를 개별 service로 우회하지 않고 root service 내부에서 처리한다.
- CLOSED 문의에는 메시지를 보낼 수 없다.
- `clientMessageId`가 중복되면 메시지 생성이 거부된다.
- 첫 응답 시각은 `senderType` 문자열이 아니라 `actorUserId !== inquiry.customerId` 기준으로 기록한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-01 | 초기 생성 (Form Bootstrap/AiForm patch 로직 문서화) | codex |
| 2026-03-11 | AI 처리 책임 설명을 ApplicationService 기준으로 갱신 | codex |
| 2026-03-11 | root 기준 메시지/참여자 처리 규칙을 추가 | codex |
