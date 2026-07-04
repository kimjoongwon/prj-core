# RoleEditScreen

## 화면 러프

```text
[PageTitleBar: route title / description / actions]

[SectionSurface]
  [RoleForm]
    - 역할 식별자
    - 표시명
    - 설명
    - 시스템 역할

  [children: route가 필요한 Role aggregate 보조 섹션]
    - 정책 할당 form
    - 추가 정보
```

## 계약

- `RoleEditScreen`은 생성/상세/수정 여부를 판단하지 않습니다.
- route가 `readOnly`를 넘기면 상세 화면입니다.
- route가 `editable`을 넘기면 field별 편집 가능 여부를 결정합니다.
- 기본 정보 필드 조합은 `RoleForm`이 소유합니다.
- 정책 할당 필드 조합은 `RolePolicyAssignmentForm`이 소유하고, route가 저장 액션을 결정합니다.
