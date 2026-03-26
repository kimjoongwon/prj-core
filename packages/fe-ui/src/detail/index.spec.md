# detail barrel 기획서

> 생성일: 2026-03-25
> 타입: feature-barrel
> 위치: packages/fe-ui/src/detail/index.ts

## 역할

`detail` 재사용 계층의 공용 export 진입점을 제공합니다.
`detail`은 `feature` 하위가 아니라 `packages/fe-ui/src` 루트에서 `feature`와 같은 위계를 가집니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `./view` | 읽기 전용 상세 본문 재사용 계층 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-25 | `detail` 루트 배럴을 추가하고 `view`를 `feature`와 같은 위계로 공개 | codex |
