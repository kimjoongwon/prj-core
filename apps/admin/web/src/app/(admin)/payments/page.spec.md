# Payment 목록 페이지 기획서

> 생성일: 2026-05-10
> 타입: page
> 경로: `/payments`

## 사용자 시나리오

1. 관리자가 결제 관리 메뉴에서 현재 선택 Space 기준 Payment 원장을 확인합니다.
2. Course 결제뿐 아니라 Product, Subscription 등 앞으로 추가될 서비스 결제도 `serviceCode`, `subjectType`, `subjectId`로 같은 목록에서 추적합니다.
3. Payment가 어떤 Enrollment, CoursePass, 외부 결제 ID와 연결되었는지 reference를 확인합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `PaymentManagementPage`
- screen component path: `packages/fe-ui/src/screen/PaymentManagementPage/PaymentManagementPage.tsx`
- route는 Orval Payment API 응답 변환, query state 전달, 새로고침 이벤트를 소유합니다.

## API 호출

route는 `usePaymentManagementPageData`를 통해 Orval 생성 Payment hook을 호출하고, API 응답을 `PaymentManagementPage` 표시 row와 query state로 변환합니다.

| 시점            | API                    | Orval hook       | 설명                                                                   | 상태      |
| --------------- | ---------------------- | ---------------- | ---------------------------------------------------------------------- | --------- |
| 클라이언트 렌더 | `GET /api/v1/payments` | `useGetPayments` | 현재 Space 권한 기준 결제 목록, 결제 대상, 참조 리소스, 결제 상태 조회 | 구현 완료 |

### Backend/API 계약

| 대상          | 계약                                                                                                                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query DTO     | `QueryPaymentDto`: `search`, `spaceId`, `payerUserId`, `status`, `method`, `provider`, `providerOrderId`, `subjectType`, `subjectId`, `referenceType`, `referenceId`, `approvedFrom`, `approvedUntil`, `skip`, `take`, `sort`                                         |
| Response DTO  | `PaymentDto`: `id`, `spaceId`, `payerUserId`, `title`, `status`, `method`, `provider`, `providerPaymentId`, `providerOrderId`, `totalAmount`, `currency`, `requestedAt`, `approvedAt`, `canceledAt`, `receiptUrl`, `memo`, `space`, `payer`, `subjects`, `references` |
| Subject DTO   | `PaymentSubjectDto`: `serviceCode`, `subjectType`, `subjectId`, `subjectLabel`, `quantity`, `unitAmount`, `totalAmount`, `currency`                                                                                                                                   |
| Reference DTO | `PaymentReferenceDto`: `serviceCode`, `referenceType`, `referenceId`, `role`, `label`                                                                                                                                                                                 |

## 이벤트 핸들러

| 이벤트           | 동작                                     |
| ---------------- | ---------------------------------------- |
| `onClickRefresh` | route가 `useGetPayments` query를 refetch |

## 변경 이력

| 일자       | 내용                                                                                 | 작성자 |
| ---------- | ------------------------------------------------------------------------------------ | ------ |
| 2026-05-10 | Payment route scaffold, Orval 연동, Space-scoped Payment/Subject/Reference 계약 추가 | codex  |
