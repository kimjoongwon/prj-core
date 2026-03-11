# AppIcon design-system 기획서

> 생성일: 2026-03-11
> 타입: primitive
> 위치: packages/fe-ui/src/design-system/icon/AppIcon.tsx

## 역할

앱에서 허용한 `AppIconName`만 정적 import로 렌더링하는 Lucide 아이콘 registry입니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AppIconProps | `name`, `className`, `size`를 받는 아이콘 렌더링 계약 |
| AppIcon | `AppIconName` -> Lucide 컴포넌트 매핑 렌더러 |

## 구현 메모

- `lucide-react`의 `icons[...]` 네임스페이스 import를 사용하지 않습니다.
- registry에 없는 이름은 타입 단계에서 막습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | `lucide-react` 네임스페이스 import 제거를 위해 앱 전용 정적 아이콘 registry를 추가 | codex |
