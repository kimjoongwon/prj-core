# RoutineEditScreen

## 목적

- `RoutineEditScreen`은 Routine aggregate의 create/detail/edit route가 공유하는 pure screen이다.
- 생성/상세/수정 여부는 route가 `title`, `actions`, `readOnly`, `editable`로 결정한다.
- 기본 정보와 활동 편집은 `RoutineForm`이 소유한다.

## Props 계약

| prop | 설명 |
| --- | --- |
| `state` | `RoutineFormState`; route-local observable form state |
| `candidateTasks` | 편집 모드에서 추가할 수 있는 운동 후보 |
| `activities` | route가 asset URL을 보강한 활동 표시 목록 |
| `readOnly` | detail route에서 `true`로 전달 |
| `programs` | detail route에서 사용 중인 프로그램 요약 |
| `metadata` | 등록일/수정일 관리 정보 |
| `actions` | route가 연결한 목록/저장/수정/삭제 action |

## 조합

| layer | component |
| --- | --- |
| form | `RoutineForm` |
| data-display | `Chip` |
| data-grid cell | `DateTimeCell` |
| input | `Button` |

## 상태별 렌더링

- `isLoading`이면 로딩 메시지를 보여준다.
- `notFound` 또는 `state` 없음이면 route가 넘긴 fallback action을 보여준다.
- `readOnly`이면 `RoutineForm` 필드를 잠그고 연결 요약/프로그램/관리 정보를 추가로 보여준다.

## 화면 러프

### Desktop

```text
[루틴 등록/상세/수정]                         [actions]

+------------------------------------------------------+
| 기본 정보                                            |
| [루틴 이름] [단축 라벨]                              |
|                                                      |
| 활동 구성                                            |
| [운동 검색]                                          |
| 후보 운동 카드 grid                                  |
| 추가된 활동 draggable list                           |
|                                                      |
| 연결 요약 / 사용 중인 프로그램 / 관리 정보 (detail)  |
+------------------------------------------------------+
```

### Mobile

```text
[루틴 등록/상세/수정]
[actions wrap]

기본 정보
[루틴 이름]
[단축 라벨]

활동 구성
[운동 검색]
[후보 카드]
[활동 카드]
```
