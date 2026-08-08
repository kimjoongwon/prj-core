# Overlay 규칙

## 역할 규칙

- 배정된 플랫폼과 경로에 맞는 overlay/dialog/popover/tooltip 규칙만 적용합니다.
- overlay 소스, 모바일 `layout/{BottomSheet,Dialog,Popover}`, `design-system/portal`, 같은 위치의 단위 테스트, 가까운 barrel export, 필요한 최소 import를 함께 관리합니다.
