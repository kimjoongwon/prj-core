# Inquiry Form APIs 기획서

> 생성일: 2026-03-01
> 타입: api-client
> 위치: packages/fe-api/src/inquiry-form-apis.ts

## 역할

문의 Form Bootstrap/AiForm 엔드포인트를 프론트에서 React Query 훅으로 사용하기 위한 API 클라이언트 레이어입니다.

## 제공 함수

| 함수 | 설명 |
|------|------|
| `getInquiryCreateForm` | `GET /api/v1/inquiries/form/create` |
| `useGetInquiryCreateForm` | 생성 bootstrap 조회 훅 |
| `prefetchGetInquiryCreateFormQuery` | 서버 컴포넌트 prefetch |
| `getInquiryUpdateForm` | `GET /api/v1/inquiries/:inquiryId/form/update` |
| `useGetInquiryUpdateForm` | 수정 bootstrap 조회 훅 |
| `prefetchGetInquiryUpdateFormQuery` | 서버 컴포넌트 prefetch |
| `fillInquiryFormWithAi` | `POST /api/v1/inquiries/form/ai-fill` |
| `useFillInquiryFormWithAi` | ai-fill mutation 훅 |

## 계약

- bootstrap 응답: `ApiResponseEntity<InquiryCreateUpdateFormBootstrap>`
- ai-fill 응답: `ApiResponseEntity<FillInquiryFormResponse>`
- ai-fill 요청: `FillInquiryFormRequest` (`mode`, `schemaKey`, `selectedPaths`, `currentObject`, `userPrompt`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-01 | 초기 생성 (문의 Form Bootstrap/AiForm API 훅 추가) | codex |
