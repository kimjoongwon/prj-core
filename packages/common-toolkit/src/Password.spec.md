# Password util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-toolkit/src/Password.ts

## 역할

비밀번호 정책 검증 유틸리티를 제공합니다. 프론트엔드 표시 컴포넌트와 백엔드 인증 application service에서 공용으로 사용합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| PasswordPolicyRule | 공개 계약 요소 |
| PasswordPolicyResult | 공개 계약 요소 |
| validatePasswordPolicy | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | AuthApplicationService 공용 사용 설명으로 문구 갱신 | codex |
