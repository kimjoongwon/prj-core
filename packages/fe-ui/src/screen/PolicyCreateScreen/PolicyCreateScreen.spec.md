# PolicyCreateScreen 기획서

> 생성일: 2026-04-28
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `form` | 정책 등록 폼 상태 |
| `abilities` | Ability 선택 옵션 |
| `isSubmitting` | 등록 요청 상태 |
| `onChange` | 입력 및 Ability 토글 핸들러 |

## 시각 Composition

- `ScreenSurface + screen SectionSurface` 구조로 기본 정보와 Ability 선택을 분리합니다.
- Policy 기본 정보는 이름/표시명/설명/시스템 여부만 입력합니다.
- Ability 체크박스 선택은 생성 route에서 별도 동기화 API로 저장합니다.