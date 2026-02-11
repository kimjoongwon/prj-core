---
name: design-analyze
description: Figma 디자인을 분석하여 기존 컴포넌트 매핑 및 신규 컴포넌트를 제안합니다. 사용자가 "Figma 분석", "디자인 분석", "컴포넌트 매핑" 등을 요청할 때 사용합니다.
allowed-tools: Bash, Read, Grep
---

# 디자인 분석 (design-analyze)

Figma MCP를 통해 가져온 디자인을 분석하고, 기존 컴포넌트로 구현 가능한지 판단하며, 필요한 경우 신규 컴포넌트를 제안합니다.

---

## 중요 원칙

**절대 하지 말아야 할 것:**

- ❌ 디자인 토큰 분석 (색상, 타이포그래피, spacing 등)
- ❌ 컴포넌트 코드 직접 작성
- ❌ HeroUI에 있는 컴포넌트 신규 제안

**반드시 해야 할 것:**

- ✅ 화면 목적과 사용자 시나리오 분석
- ✅ 필요한 API와 상태 관리 요구사항 도출
- ✅ `packages/fe-ui/components.json` 참조하여 기존 컴포넌트 매핑
- ✅ 신규 컴포넌트는 Component Builder 위임 명세 작성

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| Figma URL | ✅ | 분석할 디자인 URL (node-id 포함) |
| 화면명 | ✅ | 분석할 화면/페이지 이름 |
| 기존 요구사항 | ⚪ | 추가 컨텍스트 |

---

## 실행 지침

### 1단계: 기존 컴포넌트 목록 확인

```bash
# 컴포넌트 목록 조회
cat packages/fe-ui/components.json

# 또는 분석 명령 실행
pnpm --filter=@cocrepo/ui analyze:components
```

### 2단계: 레이아웃 컴포넌트 확인

```bash
# 레이아웃 컴포넌트
ls packages/fe-ui/src/components/layout/

# 각 레이아웃 Props 확인
grep -l "Props" packages/fe-ui/src/components/layout/**/*.tsx
```

### 3단계: UI 컴포넌트 확인

```bash
# UI 컴포넌트
ls packages/fe-ui/src/components/ui/

# Input 컴포넌트
ls packages/fe-ui/src/components/inputs/
```

---

## 화면 계층 구조 (참조)

### Level 1: 페이지 구조

| 요소 | 역할 |
|------|------|
| Layout | 페이지 전체 템플릿 |
| Portal | DOM 최상위 레이어 (모달, 토스트) |
| Shell | 앱 외곽 틀 |

### Level 2: 시맨틱 영역

| 요소 | 역할 |
|------|------|
| Main | 주요 콘텐츠 |
| Header | 페이지/섹션 헤더 |
| Nav | 네비게이션 |
| Aside | 사이드바 |
| Section | 주제별 구획 |

### Level 3: 배치/정렬

| 요소 | 역할 |
|------|------|
| Grid | 2D 그리드 배치 |
| VStack | 수직 스택 |
| HStack | 수평 스택 |
| Center | 중앙 정렬 |

### Z-index 레이어

| z-index | 요소 |
|---------|------|
| z-50 | Toast, Alert |
| z-40 | Modal, Dialog |
| z-30 | Drawer, Sheet |
| z-20 | Dropdown, Tooltip |
| z-10 | Sticky Header |
| z-0 | Base Content |

---

## 출력 형식

### 디자인 분석 리포트

```markdown
# [화면명] 분석 결과

## 1. 기획 분석

### 화면 목적
[이 화면이 존재하는 이유와 사용자 가치]

### 사용자 시나리오
1. 사용자가 [화면]에 진입한다
2. [데이터]를 확인한다
3. [액션]을 수행한다
4. [결과 화면]으로 이동한다

### 필요한 데이터
| 데이터 | 타입 | 설명 |
|--------|------|------|
| users | User[] | 사용자 목록 |
| totalCount | number | 전체 건수 |

### API 요구사항
- `GET /api/users` - 사용자 목록 조회
- `DELETE /api/users/:id` - 사용자 삭제

### 상태 관리
| 상태 | 타입 | 설명 |
|------|------|------|
| selectedIds | string[] | 선택된 항목 |
| isLoading | boolean | 로딩 여부 |

## 2. 화면 구조

┌─────────────────────────────┐
│ Header (Header 컴포넌트)    │
├──────────┬──────────────────┤
│ Sidebar  │ Main Content     │
│ (VStack) │ (DataGrid)       │
└──────────┴──────────────────┘

## 3. 사용 가능한 기존 컴포넌트

### Layout
- **DashboardLayout** - 전체 레이아웃 구조
  - Props: header, leftSidebar, children
  - 경로: packages/fe-ui/src/components/layout/Dashboard/

### UI Components
- **Button** - 액션 버튼
- **DataGrid** - 데이터 테이블

## 4. 신규 컴포넌트 제안

### 4.1. [컴포넌트명] (미존재)

**필요한 이유:**
- [기존 컴포넌트로 안 되는 이유]

**Component Builder Agent에게 요청할 내용:**
- 컴포넌트명: [컴포넌트명]
- Props: [Props 목록]
- 카테고리: ui / widget / feature
- 경로: packages/fe-ui/src/components/[카테고리]/[컴포넌트명]/

## 5. 다음 단계
1. 위의 "4. 신규 컴포넌트 제안" 내용을 Component Builder Agent에게 전달
2. 기술 설계서 작성 (etc-planner)
```

---

## HeroUI 컴포넌트 (신규 제안 금지)

다음 컴포넌트는 HeroUI에 이미 존재:

### Layout & Structure
- Card, CardHeader, CardBody, CardFooter
- Divider, Spacer

### Overlay
- Modal, Popover, Tooltip, Drawer

### Navigation
- Tabs, Breadcrumbs, Pagination, Navbar, Dropdown

### Feedback
- Progress, Spinner, Skeleton

### Display
- Badge, Chip, Avatar, Image

### Data Entry
- Slider, Switch, Checkbox, Radio, Select, Input, Textarea

**사용 방법:**
```tsx
import { Card, Badge, Avatar } from "@heroui/react";
```

---

## 체크리스트

### 분석 전
- [ ] Figma URL에서 `file-key`와 `node-id` 추출했는가?
- [ ] `packages/fe-ui/components.json` 읽어 기존 컴포넌트 목록 확인했는가?

### 분석 중
- [ ] 화면 목적과 사용자 시나리오 파악했는가?
- [ ] 필요한 API 요구사항 도출했는가?
- [ ] 디자인 요소를 기존 컴포넌트로 최대한 매핑했는가?

### 분석 후
- [ ] 신규 컴포넌트 제안 시 HeroUI 중복 확인했는가?
- [ ] Component Builder 위임 명세가 명확한가?

---

## 주의사항

- 이 Skill은 **분석 결과 리포트만** 출력합니다
- 실제 컴포넌트 생성은 `ui-component-builder`, `widget-builder` 등 빌더 에이전트가 담당합니다
- Figma MCP 도구가 필요하면 별도로 설정해야 합니다
