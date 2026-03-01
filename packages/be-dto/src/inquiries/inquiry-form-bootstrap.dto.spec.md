# Inquiry Form Bootstrap DTO 기획서

> 생성일: 2026-03-01
> 타입: dto
> 위치: packages/be-dto/src/inquiries/inquiry-form-bootstrap.dto.ts

## 역할

문의 Create/Update 화면에서 사용하는 Form Bootstrap 계약과 AiForm 요청/응답 계약을 정의합니다.

## DTO 목록

| DTO | 설명 |
|-----|------|
| `InquiryCreateUpdateFormBootstrapDto` | `mode/defaultObject/options/ui/fieldMeta/aiSchemas` 계약 |
| `FillInquiryFormRequestDto` | AiForm 채움 요청 (`mode`, `schemaKey`, `selectedPaths`, `currentObject`, `userPrompt`) |
| `FillInquiryFormResponseDto` | AiForm patch 응답 (`patches`) |
| `InquiryAiFormPatchDto` | 단일 patch (`path`, `value`) |

## 검증 규칙

- `schemaKey`: 문자열 필수
- `selectedPaths`: 문자열 배열, 최소 1개
- `currentObject`: 객체 필수
- `mode`: `CREATE` 또는 `UPDATE`
- `userPrompt`: 선택 문자열

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-01 | 초기 생성 (문의 Form Bootstrap/AiForm DTO 추가) | codex |
