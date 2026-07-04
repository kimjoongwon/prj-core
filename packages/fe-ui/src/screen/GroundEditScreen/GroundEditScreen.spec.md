# GroundEditScreen

- `GroundEditScreen`은 Ground aggregate의 상세/수정 route가 공유하는 Screen이다.
- route는 `readOnly`로 상세 모드를 결정하고, `title`, `description`, `actions`를 전달한다.
- Screen은 `GroundForm`을 사용하며 직접 입력 필드를 소유하지 않는다.
- Form은 `readOnly`와 `editable`만 기준으로 필드 편집 가능 여부를 판단한다.
