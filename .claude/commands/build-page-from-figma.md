---
description: Figma 디자인을 분석하고 정적 페이지까지 자동 빌드합니다
---

# Figma → Page 빌드 파이프라인

Figma URL 또는 디자인 설명을 입력받아 정적 페이지를 완성합니다.

## 입력

$ARGUMENTS (Figma URL 또는 디자인 설명)

## 파이프라인 (자동 진행)

중간 확인 없이 모든 단계를 순차적으로 실행합니다.

---

### 1단계: 디자인 분석

**design-analyzer** agent를 사용해서 $ARGUMENTS 분석

수행 내용:

- 화면 계층 구조 분석 (Level 0~6)
- 기존 컴포넌트 매핑 (`packages/ui/components.json` 참조)
- 신규 컴포넌트 필요 여부 판단

---

### 2단계: 신규 컴포넌트 생성 (필요시)

분석 결과에서 신규 컴포넌트가 필요하면:

**component-builder** agent를 사용해서 각 컴포넌트 생성

수행 내용:

- Pure UI 컴포넌트 생성 (stateless)
- Storybook 스토리 생성
- `apps/design`에 등록

---

### 3단계: 품질 체크

각 생성된 파일에 대해 순차 실행:

```bash
# 타입 체크
npx tsc --noEmit --pretty

# 린트 + 포맷 (자동 수정)
npx biome check --write .
```

**에러 발생 시:**

- 에러 내용 분석
- 자동 수정
- 다시 체크
- 3회 이상 실패 시 에러 보고 후 중단

---

### 4단계: 페이지 생성

**page-builder** agent를 사용해서 최종 페이지 생성

수행 내용:

- `packages/ui/src/components/page/` 경로에 페이지 컴포넌트 생성
- HTML raw 태그 사용 금지 (VStack, HStack, Text 등 사용)
- HeroUI + 프로젝트 UI 컴포넌트 조합
- Storybook 스토리 생성
- index.ts에 export 추가

---

### 5단계: 최종 검증

```bash
# 타입 체크
npx tsc --noEmit --pretty

# 린트 + 포맷
npx biome check --write .
```

모든 체크 통과 확인

---

## 완료 보고

파이프라인 완료 후 다음 정보 제공:

```markdown
## ✅ 페이지 빌드 완료

### 생성된 파일

- `packages/ui/src/components/page/[PageName].tsx`
- `packages/ui/src/components/page/[PageName].stories.tsx`
- (신규 컴포넌트가 있으면 해당 파일들도 나열)

### 품질 체크 결과

- ✅ TypeScript 타입 체크 통과
- ✅ Biome 린트/포맷 통과

### 확인 방법

\`\`\`bash

# Storybook에서 확인

pnpm --filter storybook start:dev
\`\`\`

→ http://localhost:6006 에서 Page/[PageName] 확인
```

---

## 에러 처리

### 타입 에러

- 에러 위치와 내용 파악
- Props 타입 수정 또는 import 경로 수정
- 재검증

### 린트 에러

- `npx biome check --write`로 자동 수정
- 수정 불가능한 에러는 수동 수정

### 컴포넌트 누락

- design-analyzer 결과 재확인
- component-builder로 추가 생성

---

## 주의사항

- 모든 단계는 **중간 확인 없이 자동 진행**됩니다
- 최종 결과만 보고합니다
- 에러 발생 시에만 중단하고 에러 내용을 보고합니다
