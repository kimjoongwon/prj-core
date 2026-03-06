# useFormField util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/fe-hook/src/useFormField.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| UseFormFieldSingleOptions | 공개 계약 요소 |
| UseFormFieldMultiOptions | 공개 계약 요소 |
| UseFormFieldReturn | 공개 계약 요소 |
| useFormField | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | useFormField 내부 any 사용을 제거하고 타입 가드/공용 옵션 타입 기반으로 구현 정리 | codex |
| 2026-03-06 | UseFormField 공개 타입 계약을 로컬 선언에서 @cocrepo/type import/re-export 구조로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
