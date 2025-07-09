# Shared Configuration

공통 ESLint 및 TypeScript 설정을 관리하는 패키지입니다.

## ESLint 설정

### 기본 사용법

```js
// eslint.config.js
import { react } from '@shared/config/eslint';

export default react;
```

### 사용 가능한 설정

- `base`: 기본 ESLint 설정
- `react`: React 앱용 ESLint 설정
- `node`: Node.js 앱용 ESLint 설정
- `storybook`: Storybook용 ESLint 설정

## TypeScript 설정

### 기본 사용법

```json
// tsconfig.json
{
  "extends": "@shared/config/typescript/react"
}
```

### 사용 가능한 설정

- `base`: 기본 TypeScript 설정
- `react`: React 앱용 TypeScript 설정
- `node`: Node.js 앱용 TypeScript 설정

## 설치

```bash
pnpm add -D @shared/config
```

## 의존성

이 패키지는 다음 패키지들을 peer dependency로 사용합니다:

- `eslint`
- `typescript`

각 앱에서 이 패키지들을 설치해야 합니다.