# 문의 도메인 제거

## 범위

- 문의 전용 모델은 `Inquiry`, `InquiryThread`, `InquiryMessage`, `InquiryAttachment`, `InquiryParticipant`, `InquiryTag`, `SentimentAnalysis`, `AIAgentLog` 8개다.
- 전용 enum은 `AIAgentAction`, `AttachmentFileType`, `InquiryCategory`, `InquiryChannel`, `InquiryParticipantRole`, `InquiryPriority`, `InquirySource`, `InquiryStatus`, `MessageContentType`, `SenderType`, `SentimentType`, `ThreadStatus` 12개다.
- `User`의 문의 역참조 6개와 `Space.inquiries`를 제거한다. `User`, `Space`, `Category`, `Asset` 등 공용 모델은 보존한다.
- 공용 Schema·Entity·DTO·Command/Input·Repository·타입·enum 표시 정보와 공개 export, 문의 bootstrap/demo, 생성 SDK와 manifest, 문의 통계 카드 및 오래된 도메인 설명을 함께 정리한다.
- 현재 소스에는 문의 page·menu·Controller·Module·handler 등록이 없다. 생성 SDK에 남은 문의 operation 13개는 현재 소스의 OpenAPI로 재생성해 제거한다.

## 1차 릴리스: 코드 소비 제거

- 브랜치: `codex/remove-inquiry-contracts`.
- 문의 전용 소비 코드와 공개 계약, bootstrap/demo 적재 경로, 새 문의 권한을 만드는 definition을 제거한다.
- 일반 기능을 검증하는 테스트는 생존 모델로 대체하고, `/inquiries`가 삭제된 경로임을 검증하는 테스트는 유지한다.
- DB 테이블·Prisma 모델·전용 enum·생성 Prisma Client·공개 생성 enum은 이 릴리스에 유지한다.
- 기존 DB의 문의 데이터와 권한 row는 변경하지 않는다.
- 현재 소스의 격리 OpenAPI로 공식 Orval codegen을 실행한 뒤 문의 관련 생성 diff만 반영한다. 기존 Core SDK 117개 operation 중 문의 13개를 제거해 104개를 유지하고, 문의 외 operation·schema와 IDP 계약은 보존한다. 전체 재생성에서 함께 제거되는 기존 비문의 stale operation 77개의 정합성 정리는 별도 API owner 범위로 남긴다.

## 2차 릴리스: 스키마와 데이터 제거

- 브랜치: `codex/remove-inquiry-schema`. 1차 릴리스 위에 별도 변경으로 준비하며, 승격 전까지 draft 상태를 유지한다.
- 실행 환경별로 1차 릴리스의 관련 앱 교체와 문의 테이블 소비 중단을 확인한 뒤 적용한다. 두 환경의 공통 승격 경로를 고려해 stg/prod의 1차 릴리스 검증을 먼저 끝낸다.
- 기존 문의 데이터의 보존·내보내기 필요 여부를 확정하고 백업 및 scratch DB 복원 리허설을 완료한다.
- 8개 모델·12개 enum·공용 모델의 문의 역참조를 제거하고 Prisma Client와 공개 enum을 재생성한다.
- 과거 SQL 및 reference-data migration은 수정하지 않고 새 migration을 추가한다.
- SQL은 트랜잭션 안에서 `inquiry_attachments`, `ai_agent_logs`, `sentiment_analyses`, `inquiry_participants`, `inquiry_tags`, `inquiry_messages`, `inquiry_threads`, `inquiries` 순서로 테이블을 삭제한 뒤 전용 enum을 삭제한다. 공용 테이블을 연쇄 삭제하지 않는다.
- 별도 멱등 reference-data migration에서 `menu:inquiries`, `menu:inquiries:list`, `menu:inquiries:direct`, `menu:inquiries:answered`, `menu:inquiries:faq`에 속한 `PolicyEntry` → `Ability` → `Subject`를 정리한다. 공용 Policy·RoleAssignment는 보존한다.

## 승격과 검증

- 각 릴리스는 별도 PR로 검토하고 `stg`/`main` 병합은 사용자 승인을 받는다.
- PreSync는 새 앱 rollout 전에 migration을 실행하므로 1차·2차 릴리스를 한 번에 승격하지 않는다. 2차 PR의 base를 `stg`로 변경하는 시점에도 1차 릴리스 배포 검증이 선행되어야 한다.
- 변경한 owner의 기본 검증 후 루트에서 `pnpm type-check`, `pnpm lint`, `pnpm test`를 수행한다.
- schema 규칙·Prisma validate·공개 enum 동기화·현재 OpenAPI 대비 SDK/manifest를 확인한다. 문의 이외 API의 예상하지 않은 변경이 있으면 생성 입력과 차이를 확인한다.
- migration은 백업을 복원한 scratch DB에서 실행하고 공용 데이터 보존 및 권한 정리의 재실행 안전성을 검증한다. 로컬 검증은 운영 데이터 삭제나 배포 완료를 의미하지 않는다.
- DB 삭제 이후에는 이전 앱 이미지만으로 데이터를 복구할 수 없으므로 검증한 백업 복원 절차를 사용한다.

## 후속 owner

- Prisma owner: 2차 모델·enum·역참조·SQL/reference-data migration과 생성물.
- Backend/common owner: 문의 전용 계약·export 및 생존 모델을 사용하는 회귀 검증.
- Frontend/API owner: 현재 소스 OpenAPI로 생성한 SDK·manifest와 문의 UI/문서 정리.
- 루트: 릴리스별 통합 검증·읽기 전용 세션 리뷰·PR과 승격 순서 조율.
