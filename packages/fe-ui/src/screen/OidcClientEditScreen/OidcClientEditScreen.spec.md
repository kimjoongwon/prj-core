# OidcClientEditScreen

## 화면 러프

```text
[Screen.Header: route title / description / actions]

[SectionSurface]
  [OidcClientForm]
    - 기본 정보
    - 인증 설정
    - Redirect URIs
    - 앱 복귀 설정
    - 로그인 화면 설정
    - 추가 정보

  [children: route가 필요한 상태/메타 보조 섹션]
```

## 계약

- `OidcClientEditScreen`은 생성/상세/수정 여부를 판단하지 않습니다.
- route가 `readOnly`를 넘기면 상세 화면입니다.
- route가 `editable`을 넘기면 field별 편집 가능 여부를 결정합니다.
- 필드 조합은 `OidcClientForm`이 소유합니다.
- route가 submit, cancel, delete, 활성/비활성 전환을 결정합니다.
