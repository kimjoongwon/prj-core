---
name: lint-format
description: Biome으로 린트 및 포맷 검사/수정을 수행합니다. 사용자가 "린트 체크", "포맷 체크", "코드 정리" 등을 요청하거나 코드 작성 후 품질 검증이 필요할 때 사용합니다.
allowed-tools: Bash
---

# 린트 & 포맷 체크 (Biome)

## 중요 원칙

**절대 하지 말아야 할 것:**

- ❌ ESLint, Prettier 등 다른 도구 사용 (이 프로젝트는 Biome 사용)
- ❌ 일부 파일만 체크하고 완료 보고
- ❌ 에러를 무시하고 넘어가기

**반드시 해야 할 것:**

- ✅ `npx biome check` 명령 사용
- ✅ 가능하면 `--write` 옵션으로 자동 수정
- ✅ 모든 에러/경고를 사용자에게 보고
- ✅ 수정 불가능한 에러는 명확히 설명

## 실행 지침

### 1단계: 린트 + 포맷 체크 (자동 수정 포함)

```bash
npx biome check --write .
```

- 포맷팅 자동 수정
- 린트 에러 중 자동 수정 가능한 것 수정
- 수정 불가능한 에러 목록 출력

### 2단계: 체크만 (수정 없이)

수정 없이 체크만 하려면:

```bash
npx biome check .
```

### 3단계: 특정 파일/폴더만

```bash
# 특정 파일
npx biome check --write packages/ui/src/components/page/MyPage.tsx

# 특정 폴더
npx biome check --write packages/ui/src/components/
```

## 결과 분석

### 에러가 있을 경우

```
## 린트/포맷 체크 결과

### ❌ 에러 발견

**packages/ui/src/components/page/MyPage.tsx**
- **12:5** - lint/suspicious/noExplicitAny: Unexpected any. Specify a different type.
- **25:1** - format: Expected indent of 2 spaces

**packages/ui/src/components/ui/Button.tsx**
- **8:10** - lint/style/useConst: Use const instead of let

### 자동 수정됨
- format 에러 15개 자동 수정
- lint/style 에러 3개 자동 수정

### 수동 수정 필요
- lint/suspicious/noExplicitAny: 1개 (타입 명시 필요)
```

### 에러가 없을 경우

```
## ✅ 린트/포맷 체크 통과

모든 파일이 린트 및 포맷 규칙을 준수합니다.
```

## Biome 설정 확인

프로젝트 루트의 `biome.json` 설정 참조:

```bash
cat biome.json
```

## 자주 발생하는 에러와 해결

### 1. noExplicitAny

```tsx
// ❌ 에러
const data: any = ...

// ✅ 수정
const data: unknown = ...
// 또는 구체적인 타입 지정
```

### 2. useConst

```tsx
// ❌ 에러
let value = "fixed";

// ✅ 수정
const value = "fixed";
```

### 3. noUnusedVariables

```tsx
// ❌ 에러
const unused = "value";

// ✅ 수정: 사용하거나 삭제
```

### 4. 포맷 에러

대부분 `--write` 옵션으로 자동 수정됨

## 통합 품질 체크

타입 체크와 함께 실행하려면:

```bash
# 타입 체크
npx tsc --noEmit --pretty

# 린트 + 포맷
npx biome check --write .
```

## 주의사항

- `biome.json`에 정의된 규칙을 따릅니다
- `node_modules`, `dist` 등은 자동 제외됩니다
- 에러가 너무 많으면 주요 에러 위주로 요약하되, 전체 개수는 반드시 보고
