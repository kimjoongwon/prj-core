# TimelineEditScreen

## 목적

- `TimelineEditScreen`은 Timeline aggregate의 create/detail/edit route가 공유하는 pure screen이다.
- 생성/상세/수정 여부는 route가 `title`, `actions`, `readOnly`, `editable`로 결정한다.
- 편집 필드는 `TimelineForm`이 소유하고, Screen은 폼과 세션 요약/목록 섹션을 배치한다.

## Props 계약

| prop | 설명 |
| --- | --- |
| `title`, `description` | route가 결정한 화면 제목과 설명 |
| `state` | `TimelineFormState`; 없으면 not found fallback 렌더 |
| `readOnly` | detail route에서 `true`로 전달 |
| `editable` | route가 필드별 편집 가능 여부를 제한 |
| `actions` | route가 연결한 목록/저장/수정/삭제 action |
| `metadata` | detail mode에서 보여줄 생성일 등 관리 정보 |
| `sessions` | detail mode에서 보여줄 연결 세션 목록 |

## 조합

| layer | component |
| --- | --- |
| form | `TimelineForm` |
| data-grid cell | `DateTimeCell` |
| data-display | `Chip` |
| input | `Button` |

## 상태별 렌더링

- `isLoading`이면 타이틀과 로딩 메시지만 보여준다.
- `notFound` 또는 `state` 없음이면 not found fallback을 보여준다.
- `readOnly`이면 `TimelineForm` 필드를 잠그고, 전달된 `sessions`가 있으면 세션 목록을 함께 보여준다.

## 화면 러프

### Desktop

```text
[타임라인 상세/수정]                         [actions]

+------------------------------------------------------+
| 기본 정보                                            |
| [타임라인명]                                         |
| [설명 textarea]                                      |
|                                                      |
| 관리 정보 (optional)                                |
| 등록일                                               |
|                                                      |
| 세션 목록 (optional)                    [세션 등록] |
| [전체] [연결됨] [미연결]                             |
| table: 세션명 / 유형 / 프로그램 / 상태 / 일시 / 액션 |
+------------------------------------------------------+
```

### Mobile

```text
[타임라인 상세/수정]
[actions wrap]

기본 정보
[타임라인명]
[설명]

세션 목록
[요약 카드 stacked]
[세션 row]
[세션 row]
```
