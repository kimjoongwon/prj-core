---
name: type-check
description: TypeScript 타입 에러를 정확하게 검사하고 보고합니다. 사용자가 "타입 체크", "타입 에러 확인", "타입 검증" 등을 요청하거나 코드 작성 후 타입 안정성을 확인할 때 사용합니다.
allowed-tools: Bash
---

# TypeScript 타입 체킹

## 중요 원칙

**절대 하지 말아야 할 것:**
- ❌ `grep`, `head`, `tail`, `awk`, `sed` 등으로 타입 체크 출력을 필터링하지 않기
- ❌ 일부 에러만 보여주지 않기
- ❌ "에러 없음"이라고 추측하지 않기
- ❌ 특정 파일만 검색하지 않기

**반드시 해야 할 것:**
- ✅ `npx tsc --noEmit --pretty` 명령을 **필터링 없이** 실행
- ✅ 전체 타입 체크 결과를 완전히 확인
- ✅ 모든 에러를 사용자에게 보고
- ✅ 파일별로 에러를 그룹화하여 명확하게 표시

## 실행 지침

### 1단계: 타입 체크 실행

```bash
npx tsc --noEmit --pretty
```

- **절대 grep, head, tail 등을 사용하지 않음**
- 전체 출력을 그대로 확인
- timeout을 120000ms로 설정 (대형 프로젝트 대응)

### 2단계: 결과 분석

전체 출력에서:
1. 에러가 발생한 파일들을 파악
2. 각 파일의 에러 위치(줄 번호) 확인
3. 에러 메시지와 타입 코드(예: TS2339) 확인
4. 총 에러 개수 확인

### 3단계: 보고

#### 타입 에러가 있을 경우

```
## 타입 체크 결과

### ❌ 타입 에러 발견

**packages/ui/src/components/page/DogWalkRequestPage.tsx**
- **53번째 줄**: `TS2339` - Property 'children' does not exist on type 'InfoMessageProps'
- **89번째 줄**: `TS2339` - Property 'color' does not exist on type 'TextProps'

**packages/api-client/src/model/qn.ts**
- **14번째 줄**: `TS1005` - ',' expected

**총 3개의 타입 에러**

### 수정 제안
[각 에러에 대한 구체적인 수정 방법 제시]
```

#### 타입 에러가 없을 경우

```
## ✅ 타입 체크 통과 - 에러 없음

모든 TypeScript 타입이 올바르게 정의되어 있습니다.
```

## 에러 분석 가이드

1. **컴포넌트 타입 불일치**: Props 타입 정의 확인 필요
2. **Import 에러**: 경로나 export 확인
3. **Missing 타입**: 타입 정의 추가 필요
4. **의존성 타입 에러**: `node_modules` 에러는 프로젝트 코드와 분리하여 보고

## 잘못된 예시 (절대 하지 마세요)

```bash
# ❌ grep으로 필터링 - 에러를 놓칠 수 있음
npx tsc --noEmit 2>&1 | grep "error TS"

# ❌ head로 제한 - 일부 에러만 보여줌
npx tsc --noEmit 2>&1 | head -20

# ❌ 특정 파일만 검색 - 다른 에러를 놓칠 수 있음
npx tsc --noEmit 2>&1 | grep "DogWalkRequestPage"
```

## 올바른 예시

```bash
# ✅ 전체 출력 확인
npx tsc --noEmit --pretty

# ✅ 에러가 너무 많으면 파일로 저장 후 분석
npx tsc --noEmit --pretty > /tmp/type-errors.txt 2>&1
cat /tmp/type-errors.txt
```

## 주의사항

- `tsconfig.json`의 `skipLibCheck: true` 옵션이 있어도 프로젝트 코드의 타입은 반드시 체크됨
- 의존성 패키지(node_modules)의 타입 에러와 프로젝트 코드의 에러를 구분하여 보고
- 프로젝트 코드의 타입 에러는 **절대** 놓치면 안 됨
- 에러가 100개 이상이면 주요 에러 위주로 요약하되, 전체 개수는 반드시 보고
