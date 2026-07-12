# TimelineSessionProgramEditScreen

## 목적

- `TimelineSessionProgramEditScreen`은 Timeline Session Program aggregate의 create/detail/edit route가 공유하는 pure screen이다.
- 생성/상세/수정 여부는 route가 `title`, `actions`, `readOnly`, `editable`로 결정한다.
- 프로그램 입력 필드는 `TimelineSessionProgramForm`이 소유하고 picker content는 `domain/program/ProgramPicker`가 소유한다.

## Props 계약

| prop | 설명 |
| --- | --- |
| `state` | `TimelineSessionProgramFormState`; route-local observable form state |
| `routinePreview` | 선택한 루틴 또는 저장된 실행 계획 preview |
| `readOnly` | detail route에서 `true`로 전달 |
| `metadata` | 루틴/세션 링크, 강사, 등록일 등 관리 정보 |
| `actions` | route가 연결한 저장/수정/삭제 action |

## 조합

| layer | component |
| --- | --- |
| form | `TimelineSessionProgramForm` |
| domain | `ProgramPicker`, `ProgramPickerState` |
| overlay | `AppModalHost` |
| data-grid cell | `DateTimeCell` |
| input | `Button` |

## 상태별 렌더링

- `isLoading`이면 로딩 메시지를 보여준다.
- `notFound` 또는 `state` 없음이면 fallback을 보여준다.
- `readOnly`이면 form field와 picker를 잠그고 관리 정보를 추가로 보여준다.

## 화면 러프

### Desktop

```text
[프로그램 등록/상세/수정]                     [actions]

+------------------------------------------------------+
| 기본 정보                                            |
| [프로그램 이름]                                      |
| [루틴 readonly] [루틴 선택]                          |
| [강사 readonly] [강사 선택]                          |
| 연결 요약                                            |
| 실행 운동 preview                                    |
| [정원] [난이도]                                      |
| 관리 정보 (detail)                                  |
+------------------------------------------------------+
```

### Mobile

```text
[프로그램 등록/상세/수정]
[actions wrap]

프로그램 이름
루틴 선택
강사 선택
실행 운동 preview
관리 정보
```
