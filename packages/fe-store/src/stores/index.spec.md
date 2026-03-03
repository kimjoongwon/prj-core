# index store 기획서

> 생성일: 2026-03-03
> 타입: store
> 위치: packages/fe-store/src/stores/index.ts

## 역할

이 파일은 store 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ./abilityStore | 기능 구현 의존성 |
| ./authStore | 기능 구현 의존성 |
| ./bottomTabStore | 기능 구현 의존성 |
| ./cookieStore | 기능 구현 의존성 |
| ./fabStore | 기능 구현 의존성 |
| ./navItem | 기능 구현 의존성 |
| ./navigationStore | 기능 구현 의존성 |
| ./navigator | 기능 구현 의존성 |
| ./persistStore | 기능 구현 의존성 |
| ./rootStore | 기능 구현 의존성 |
| ./tokenStore | 기능 구현 의존성 |
| ./useAbility | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
