# TimelineSessionEditScreen

## 목적

- `TimelineSessionEditScreen`은 Timeline Session aggregate의 create/detail/edit route가 공유하는 pure screen이다.
- 생성/상세/수정 여부는 route가 `title`, `actions`, `readOnly`, `editable`로 결정한다.
- 세션 입력 필드는 `TimelineSessionForm`이 소유하고, Screen은 프로그램 연결 허브와 관리 정보를 조합한다.

## Props 계약

| prop | 설명 |
| --- | --- |
| `state` | `TimelineSessionFormState`; route-local observable form state |
| `readOnly` | detail route에서 `true`로 전달 |
| `metadata` | 세션 유형 표시, 타임라인 링크, 등록일 |
| `programs` | detail route에서 보여줄 프로그램 목록 |
| `actions` | route가 연결한 저장/수정/삭제 action |

## 조합

| layer | component |
| --- | --- |
| form | `TimelineSessionForm` |
| data-display | `Chip` |
| data-grid cell | `DateTimeCell` |
| input | `Button` |

## 상태별 렌더링

- `isLoading`이면 로딩 메시지를 보여준다.
- `notFound` 또는 `state` 없음이면 fallback을 보여준다.
- `readOnly`이면 form field를 잠그고 프로그램 연결 허브를 함께 보여준다.

## 화면 러프

### Desktop

```text
[세션 등록/상세/수정]                         [actions]

+------------------------------------------------------+
| 기본 정보                                            |
| [세션명] [세션 유형] [설명]                          |
| 일정 설정                                            |
| [일시 또는 반복 요일/주기]                           |
| 관리 정보 (detail)                                  |
| 프로그램 연결 허브 (detail)                          |
| table: 프로그램명 / 루틴 / 운동 수 / 강사 / 액션      |
+------------------------------------------------------+
```

### Mobile

```text
[세션 등록/상세/수정]
[actions wrap]

기본 정보
일정 설정
관리 정보
프로그램 카드 목록
```
