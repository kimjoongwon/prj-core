# TokenService 테스트 기획서

> 생성일: 2026-04-14
> 타입: unit-test
> 위치: packages/be-service/__tests__/token.service.spec.ts

## 역할

`TokenService`가 인증 cookie 설정/삭제와 blacklist 조회만 책임지고, selectedSpace 전용 cookie 책임을 더 이상 가지지 않는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | selectedSpace cookie helper 제거 이후 TokenService 핵심 책임만 검증하는 test sidecar를 신규 생성 | codex |
