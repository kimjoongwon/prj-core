# PolicyEditScreen

## 화면 러프

```text
[Screen.Header: route title / description / actions]

[SectionSurface]
  [PolicyForm]
    기본 정보
      - 정책 이름
      - 표시명
      - 설명
    Ability 선택
      - ability option list

  [children: route가 필요한 보조 상세 섹션]
```

## 계약

- `PolicyEditScreen`은 생성/상세/수정 여부를 판단하지 않습니다.
- route가 `readOnly`를 넘기면 상세 화면입니다.
- route가 `editable`을 넘기면 field별 편집 가능 여부를 결정합니다.
- field 조합과 ability 선택 UI는 `PolicyForm`이 소유합니다.
