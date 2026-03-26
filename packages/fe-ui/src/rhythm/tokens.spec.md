# rhythm tokens 기획서

> 생성일: 2026-03-26
> 타입: rhythm
> 위치: packages/fe-ui/src/rhythm/tokens.ts

## 역할

`rhythm` 레이어에서 사용하는 공통 spacing scale과 Tailwind class 매핑을 정의합니다.
구조적 의미는 이 파일이 아니라 `presets.ts`가 소유하며, 이 파일은 숫자 scale과 class 해석만 담당합니다.

## 동작

- 지원 scale은 `0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24`입니다.
- `VStack`용 Tailwind gap class, `Spacer`용 축별 width/height class를 제공합니다.
- `HStack`의 legacy numeric gap 호환을 위해 px literal gap class도 함께 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | rhythm rule layer용 spacing scale/class 매핑 추가 | codex |
