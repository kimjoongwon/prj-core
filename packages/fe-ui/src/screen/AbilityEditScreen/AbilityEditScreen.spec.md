# AbilityEditScreen

## 화면 러프

```text
[Screen.Header: route title / description / pageActions]

[SectionSurface]
  [AbilityForm]
    기본 정보
      - 권한 이름
      - 설명
    CASL 정보
      - Subject
      - Action
      - Fields
      - Conditions
      - inverted / reason

  [children: route가 필요한 상세 보조 섹션]
```

## 계약

- `AbilityEditScreen`은 생성/상세/수정 여부를 판단하지 않습니다.
- route가 `readOnly`를 넘기면 상세 화면입니다.
- route가 `editable`을 넘기면 field별 편집 가능 여부를 결정합니다.
- 필드 조합은 `AbilityForm`이 소유합니다.
- route가 submit, back, delete 같은 page action을 결정합니다.
