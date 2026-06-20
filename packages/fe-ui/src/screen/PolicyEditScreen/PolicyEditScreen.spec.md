# PolicyEditScreen 기획서

> 생성일: 2026-04-28
> 타입: fe-ui-screen

## Props 계약

| prop | 설명 |
|------|------|
| `status` | loading/not_found/ready 렌더 상태 |
| `form` | 정책 수정 폼 상태 |
| `abilities` | Ability 선택 옵션 |
| `isSubmitting` | 저장 요청 상태 |
| `onChange` | 입력 및 Ability 토글 핸들러 |

## 시각 Composition

- ready 상태에서는 `PolicyFormBody`를 재사용해 등록 화면과 동일한 입력 구조를 제공합니다.
- loading/not_found 상태는 폼 shell 안에서 간단한 상태 블록을 렌더링합니다.
- 저장 route는 기본 정보 수정 후 Ability 전체 동기화를 별도 수행합니다.