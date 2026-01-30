---
name: fe-review
description: 프론트엔드 코드를 검증하고 규칙 위반 리포트를 생성합니다. 사용자가 "프론트엔드 리뷰", "FE 검증", "컴포넌트 규칙 체크" 등을 요청할 때 사용합니다.
allowed-tools: Bash, Read, Grep
---

# 프론트엔드 리뷰 (fe-review)

프론트엔드 코드를 검증하고 규칙 위반 리포트를 생성합니다.

---

## 중요 원칙

**절대 하지 말아야 할 것:**

- ❌ 직접 코드 수정 (수정 기능 제거됨)
- ❌ 빌더 에이전트 호출 (Task 도구 없음)
- ❌ 위반 사항 무시

**반드시 해야 할 것:**

- ✅ 모든 규칙 검증 (하나라도 위반 시 보고)
- ✅ 구체적인 위반 위치 명시 (파일, 라인, 현재 코드)
- ✅ 위반 사항별 수정 방향 안내

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 검증 대상 경로 | ✅ | 검증할 파일/폴더 경로 |
| 컴포넌트 유형 | ⚪ | page, feature, widget, ui, input, cell, layout, store |

---

## 실행 지침

### 1단계: Critical 규칙 검증

```bash
# 1. useMemo/useCallback 금지 검사
grep -rn "useCallback\|useMemo" [대상경로] --include="*.tsx" --include="*.ts"

# 2. API 직접 호출 금지 검사
grep -rEn "axios\.|fetch\(" [대상경로] --include="*.tsx" --include="*.ts"

# 3. 공용 패키지 앱 종속 이름 검사
grep -rEn "(Admin|Coin)[A-Z][a-zA-Z]*Store|use(Admin|Coin)[A-Z]" packages/ --include="*.ts" --include="*.tsx"

# 4. packages/ui에서 Context API 사용 금지 검사
grep -rEn "createContext|useContext" packages/ui/ --include="*.tsx" --include="*.ts"

# 5. 컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 금지 검사
find packages/ui/src/components -type d \( -name "hooks" -o -name "utils" -o -name "inputs" \) | grep -v "components/inputs$"
```

### 2단계: 컴포넌트 유형별 검증

#### Page 컴포넌트

```bash
# 핸들러 네이밍 (handle -> on[Event][UI] 필요)
grep -rEn "handle[A-Z]" [Page경로] --include="*.tsx"

# PageSurface 필수
grep -L "PageSurface" [Page경로]/**/page.tsx [Page경로]/**/_client.tsx 2>/dev/null

# Prefetch 구조 확인 (page.tsx가 서버 컴포넌트인지)
grep -l "use client" [Page경로]/page.tsx  # 있으면 위반

# _client.tsx, _prefetch.ts 존재 확인
ls [Page경로]/_client.tsx [Page경로]/_prefetch.ts 2>/dev/null
```

#### Widget 컴포넌트

```bash
# Store 직접 접근 금지
grep -rEn "useStore|useContext" [Widget경로] --include="*.tsx"

# 커스텀 className 금지
grep -rEn 'className="[^"]*\b(flex|grid|gap-|mt-|mb-)\b' [Widget경로] --include="*.tsx"
```

#### Feature 컴포넌트

```bash
# 커스텀 className 금지
grep -rEn 'className="[^"]*\b(flex|grid|gap-|mt-|mb-)\b' [Feature경로] --include="*.tsx"
```

### 3단계: observer 규칙 검증

```bash
# "use client" 파일에서 observer 미사용 확인
for file in $(grep -rl "use client" [대상경로] --include="*.tsx"); do
  if ! grep -q "observer(" "$file"; then
    echo "observer 미사용: $file"
  fi
done
```

### 4단계: 스타일링 규칙 검증

| 위치 | className 사용 |
|------|:-------------:|
| `components/ui/` | ✅ 허용 |
| `components/inputs/` | ✅ 허용 |
| `components/ui/data-display/cells/` | ✅ 허용 |
| `components/widget/` | ❌ 금지 |
| `components/feature/` | ❌ 금지 |
| `components/page/` | ❌ 금지 |
| `components/layouts/` | ❌ 금지 |
| `apps/*/app/**/*.tsx` (Page) | ❌ 금지 |

---

## 검증 체크리스트

### 공통 (모든 유형)

- [ ] useMemo/useCallback 금지
- [ ] API 직접 호출 금지 (axios, fetch)
- [ ] observer 필수 ("use client" 컴포넌트)
- [ ] 공용 패키지 앱 종속 이름 금지
- [ ] **packages/ui에서 Context API 사용 금지 (createContext, useContext)**
- [ ] **컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 금지 (패키지 레벨에서 관리)**

### Page 전용

- [ ] 핸들러 네이밍 (`on[Event][UI]` 형태)
- [ ] PageSurface 필수
- [ ] Prefetch 구조 (page.tsx + _client.tsx + _prefetch.ts)
- [ ] Cell 컴포넌트 재사용

### Widget/Feature/Layout 전용

- [ ] 커스텀 className 금지
- [ ] Widget: Store 직접 접근 금지

---

## 결과 리포트 템플릿

### 통과 리포트

```markdown
## ✅ 프론트엔드 리뷰 완료

### 검증 대상
- **경로:** apps/admin/app/(admin)/users/
- **유형:** Page
- **파일 수:** 3개

### 검증 결과

| 규칙 | 상태 | 비고 |
|------|------|------|
| 메모이제이션 금지 | ✅ 통과 | useCallback/useMemo 없음 |
| 핸들러 네이밍 | ✅ 통과 | on[Event][UI] 형태 준수 |
| PageSurface 사용 | ✅ 통과 | PageSurface 적용됨 |
| API 사용 | ✅ 통과 | @cocrepo/api 사용 |
| MobX observer | ✅ 통과 | observer 적용됨 |
| 스타일링 규칙 | ✅ 통과 | 커스텀 className 없음 |
| Prefetch 구조 | ✅ 통과 | page.tsx + _client.tsx + _prefetch.ts |

### 품질 점수: 100/100
```

### 위반 리포트

```markdown
## ⚠️ 프론트엔드 리뷰 - 수정 필요

### 검증 대상
- **경로:** packages/ui/src/components/widget/UserCard/
- **유형:** Widget
- **파일 수:** 2개

### 위반 사항 (2건)

#### 1. Store 직접 접근 위반
```
파일: packages/ui/src/components/widget/UserCard/UserCard.tsx:15
현재: const store = useUserStore();
수정 방향: props로 userData 전달받도록 변경
```

#### 2. 커스텀 className 위반
```
파일: packages/ui/src/components/widget/UserCard/UserCard.tsx:28
현재: <div className="flex items-center gap-2">
수정 방향: <HStack gap={2}> 사용
```

### 수정 방법
1. Widget은 Store에 직접 접근하지 않고 props로 데이터를 받습니다
2. 커스텀 className 대신 HStack, VStack, Grid 등 레이아웃 컴포넌트 사용

### 품질 점수: 70/100
```

---

## 주의사항

- 이 Skill은 **검증과 리포트만** 수행합니다
- 코드 수정은 사용자가 빌더 에이전트를 별도로 호출해야 합니다
- 위반 사항 발견 시 구체적인 수정 방향을 안내합니다
