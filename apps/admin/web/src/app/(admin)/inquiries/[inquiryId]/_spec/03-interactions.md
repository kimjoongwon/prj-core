# 문의 상세 응답 연결

## Route / Screen Mapping

| 항목 | 계약 |
|------|------|
| Route | `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/page.tsx` |
| page 역할 | `detail` |
| reusable 대상 | `detail/view` |
| Screen | `packages/fe-ui/src/screen/InquiryEditScreen/InquiryEditScreen.tsx`의 `readOnly` 화면 |
| SSR/prefetch | 사용하지 않음 |

## 참여자 상태

- `getInquiryParticipants`의 생성 SDK 타입을 입력 기준으로 사용한다. SDK가 복원한 `bigint` 식별자와 `Date`를 문자열 wire guard로 걸러내지 않는다.
- `utils/inquiry-participant.ts`는 참여자 응답을 화면과 WebSocket이 공유하는 `@cocrepo/type`의 `InquiryParticipant`로 변환한다.
- 식별자는 정밀도 손실 없이 decimal string으로, 날짜는 ISO 문자열로 변환하고 선택 값은 `null`을 유지한다.
- 기존 화면 역할 표현을 유지한다. `CUSTOMER`와 `SUPERVISOR`는 그대로 전달하고 `AGENT`와 `VIEWER`는 `AGENT`로 표시한다.

## 검증 / Acceptance

- route owner는 `utils/inquiry-participant.test.ts`에서 안전한 정수 범위를 넘는 ID, nullable 날짜·스레드, 기존 역할 표현을 검증한다.
- 앱 타입 검사에서 생성 SDK → route → 기존 Screen의 계약을 확인한다.
