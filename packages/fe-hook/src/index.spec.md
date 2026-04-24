# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/fe-hook/src/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | API/Next/store concrete 의존을 갖지 않는 공용 hook과 hook helper 배럴 export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | useAbilities/useSpaceBootstrap를 주입형 hook으로 정리한 배럴 계약을 반영 | codex |
| 2026-04-16 | admin/idp 공용 space bootstrap 훅 export를 루트 배럴에 추가 | codex |
| 2026-03-06 | CASL 관련 배럴 export를 제거하고 fe-hook을 순수 훅 집합으로 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
