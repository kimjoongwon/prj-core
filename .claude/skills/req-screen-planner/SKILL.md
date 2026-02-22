---
name: req-screen-planner
description: 기능(Feature)과 화면(Screen) 레이어를 기획하는 전문가. 사용자가 "기능 기획", "화면 설계", "라우팅 설계" 등을 요청할 때 사용합니다.
allowed-tools: Read, Write, Grep, Bash
---

# L3-L4 기능/화면 기획자 (Feature/Screen Planner)

도메인의 **기능과 화면**을 정의하고 각 페이지별 `page.spec.md`를 생성하는 전문가입니다.

---

## 담당 레이어

| 레벨 | 타입 | 설명 |
|------|------|------|
| **L3** | feature | 사용자 목표를 달성하기 위한 구체적 기능 |
| **L4** | screen | 기능을 구현하는 화면 |

---

## 출력 파일

```
apps/[app]/app/(admin)/[도메인]/
├── page.spec.md                    # 목록 페이지 기획서
├── [entityId]/
│   └── page.spec.md                # 상세 페이지 기획서
├── new/
│   └── page.spec.md                # 등록 페이지 기획서
└── [entityId]/edit/
    └── page.spec.md                # 수정 페이지 기획서
```

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| app.spec.md | ✅ | L0-L2 기획 결과 |
| 앱명 | ✅ | 대상 앱 |
| 도메인명 | ✅ | 기획할 도메인 |
| 페이지 목록 | ❌ | 생성할 페이지 목록 |

---

## 프로세스

```
1단계: app.spec.md 읽기
   ↓
2단계: 목표별 필요 화면 도출
   ↓
3단계: 각 화면별 page.spec.md 생성
   ↓
4단계: 기존 파일 확인 (있으면 스킵/업데이트)
   ↓
→ req-api-planner에게 전달
```

### 기능 분류 기준

| 분류 | 설명 | 경로 | 페이지명 |
|------|------|------|----------|
| 목록 조회 | 여러 항목 조회 | /[도메인]s | [도메인]List |
| 상세 조회 | 단일 항목 상세 | /[도메인]s/[entityId] | [도메인]Detail |
| 생성 | 새 항목 추가 | /[도메인]s/new | [도메인]Create |
| 수정 | 기존 항목 변경 | /[도메인]s/[entityId]/edit | [도메인]Edit |

### RESTful 라우팅 규칙

```
/[도메인]s                    → 목록
/[도메인]s/new                → 등록
/[도메인]s/[entityId]         → 상세
/[도메인]s/[entityId]/edit    → 수정
```

---

## 페이지 타입별 기획서 내용

### 목록 페이지 (List)

```markdown
# [도메인] 목록 페이지 기획서

## 사용자 시나리오
1. 관리자가 [도메인] 메뉴 클릭
2. [도메인] 목록 페이지 진입
3. 검색/필터로 원하는 항목 찾기
4. 특정 항목 클릭 → 상세 페이지 이동

## 레이아웃 구성
| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| Header | [Domain]ListHeader | `./_components/[Domain]ListHeader.spec.md` |
| Main | [Domain]DataTable | `./_components/[Domain]DataTable.spec.md` |
| Sidebar | SearchFilter | `./_components/SearchFilter.spec.md` |

## 페이지 상태
| 상태 | 설명 | UI |
|------|------|-----|
| loading | 초기 로딩 | Skeleton |
| empty | 데이터 없음 | EmptyState |
| error | API 실패 | ErrorAlert |
| success | 정상 | DataGrid |

## API 호출
| 시점 | API | 캐싱 |
|------|-----|------|
| 진입 | GET /[api]/[domain]s | 5분 |
| 검색 | GET /[api]/[domain]s?search= | X |

## 이벤트 핸들러
| 이벤트 | 동작 |
|--------|------|
| onClickCreate | /[domain]s/new 이동 |
| onClickItem | /[domain]s/:id 이동 |
| onDelete | 삭제 확인 모달 |
```

### 상세 페이지 (Detail)

```markdown
# [도메인] 상세 페이지 기획서

## 사용자 시나리오
1. 목록에서 항목 클릭
2. 상세 페이지 진입
3. 상세 정보 확인
4. 수정/삭제 액션 수행

## 레이아웃 구성
| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| Header | DetailHeader | `./_components/DetailHeader.spec.md` |
| Main | [Domain]InfoCard | `./_components/[Domain]InfoCard.spec.md` |
| Tabs | [Domain]Tabs | `./_components/[Domain]Tabs.spec.md` |

## API 호출
| 시점 | API | 캐싱 |
|------|-----|------|
| 진입 | GET /[api]/[domain]s/:id | 1분 |
| 삭제 | DELETE /[api]/[domain]s/:id | - |

## 이벤트 핸들러
| 이벤트 | 동작 |
|--------|------|
| onClickEdit | /[domain]s/:id/edit 이동 |
| onClickDelete | 삭제 확인 모달 |
| onClickBack | /[domain]s 이동 |
```

### 등록/수정 페이지 (Create/Edit)

```markdown
# [도메인] 등록 페이지 기획서

## 사용자 시나리오
1. 목록에서 등록 버튼 클릭
2. 등록 폼 진입
3. 필드 입력
4. 저장 버튼 클릭 → 목록으로 이동

## 레이아웃 구성
| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| Header | FormHeader | `./_components/FormHeader.spec.md` |
| Main | [Domain]Form | `./_components/[Domain]Form.spec.md` |
| Footer | FormActions | `./_components/FormActions.spec.md` |

## 폼 필드
| 필드 | 타입 | 필수 | 유효성 |
|------|------|------|--------|
| name | text | O | 최대 50자 |
| email | email | O | 이메일 형식 |
| role | select | O | - |

## API 호출
| 시점 | API | 성공 시 동작 |
|------|-----|-------------|
| 저장 | POST /[api]/[domain]s | 목록 이동 |
| 수정 | PUT /[api]/[domain]s/:id | 상세 이동 |

## 이벤트 핸들러
| 이벤트 | 동작 |
|--------|------|
| onSubmit | API 호출 |
| onCancel | 이전 페이지 이동 |
```

---

## 기존 파일 확인 로직

```bash
# 각 페이지별 .spec.md 존재 확인
pages=(
  "page.spec.md"                  # 목록
  "[entityId]/page.spec.md"      # 상세
  "new/page.spec.md"             # 등록
  "[entityId]/edit/page.spec.md" # 수정
)

for page in "${pages[@]}"; do
  path="apps/[app]/app/(admin)/[도메인]/$page"
  if [ -f "$path" ]; then
    # 존재하면 개선 필요한지 판단
    # 필요시 업데이트 + 변경 이력 추가
  else
    # 없으면 새로 생성
  fi
done
```

---

## 품질 체크리스트

### L3 체크리스트
- [ ] 모든 Goal에 최소 1개 이상의 Feature가 있는가?
- [ ] 기능명이 동사 + 명사 형태인가?
- [ ] CRUD 기능이 누락되지 않았는가?

### L4 체크리스트
- [ ] 모든 Feature에 구현 화면이 연결되었는가?
- [ ] 라우팅 경로(path)가 RESTful 규칙을 따르는가?
- [ ] 각 페이지에 page.spec.md가 생성되었는가?

---

## 사용 예시

```
/req-screen-planner

앱명: admin
도메인: Member
app.spec.md 위치: apps/admin/app/(admin)/app.spec.md

필요한 페이지:
- 목록 (/users)
- 상세 (/users/[userId])
- 등록 (/users/new)
- 수정 (/users/[userId]/edit)
```

---

## 연관 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| `/req-context-planner` | 이전 단계 | 컨텍스트/사용자/목표 |
| `/orch-requirement` | 상위 | 전체 기획 흐름 조율 |
| `/req-api-planner` | 다음 단계 | 인터랙션/API 기획 |
