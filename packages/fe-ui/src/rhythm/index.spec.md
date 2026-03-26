# rhythm 배럴 기획서

> 생성일: 2026-03-26
> 타입: rhythm
> 위치: packages/fe-ui/src/rhythm/index.ts

## 역할

`@cocrepo/ui`의 간격/정렬/흐름 primitive export 진입점을 관리합니다.
배치 리듬을 결정하는 primitive만 선택적으로 re-export 합니다.

## 동작

- `VStack`, `HStack`, `Spacer`를 공용 rhythm primitive로 export합니다.
- semantic rhythm preset과 spacing scale helper(`presets.ts`, `tokens.ts`)도 함께 export합니다.
- 구조 shell(`App`, `Page`, `Section`, `Container`, `Modal`)은 `layout` 배럴이 계속 소유합니다.
- raw spacing token은 `design-system/theme/tokens.ts`에 남기고, 이 배럴은 실제 배치 primitive만 노출합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | semantic preset과 spacing helper export를 추가해 rhythm를 규칙 레이어로 확장 | codex |
| 2026-03-26 | `layout`에서 `VStack`/`HStack`/`Spacer`를 분리한 rhythm 배럴 신규 생성 | codex |
