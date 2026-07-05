# ActionEditScreen

## 화면 러프

### Desktop / Tablet / Mobile

```text
[Screen.Header: route가 전달한 title, description, actions]

[SectionSurface]
  [ActionForm]
    - 행위 식별자
    - 표시명
    - 설명
    - 분류
    - 정렬 순서

  [children: route가 필요한 상세 보조 섹션]
```

## 계약

- `ActionEditScreen`은 Action 생성/상세/수정 판단을 하지 않습니다.
- route가 `title`, `description`, `actions`, `readOnly`, `editable`을 결정합니다.
- 상세 화면은 `readOnly=true`를 전달합니다.
- 생성/수정 화면의 필드별 수정 가능 여부는 `editable`로 전달합니다.
- 필드 조합은 `ActionForm`이 소유합니다.
