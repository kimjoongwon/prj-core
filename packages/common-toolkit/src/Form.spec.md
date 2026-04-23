# Form util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-toolkit/src/Form.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| Validation | 공개 계약 요소 |
| validateSingleField | 공개 계약 요소 |
| validateFields | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-23 | `validateFields`의 path reduce를 `Record<string, unknown>` 기반 안전 인덱싱으로 정리해 strict type-check를 통과하도록 수정 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
