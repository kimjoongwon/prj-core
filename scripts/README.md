# 📦 패키지 배포 스크립트 가이드

이 디렉토리에는 monorepo 내 패키지 버전 관리 및 배포를 위한 스크립트들이 포함되어 있습니다.

## 🎯 주요 스크립트

### 1. `release-pkg.js` - 패키지 릴리즈 자동화

단일 패키지의 버전 업데이트, 빌드, 배포를 한 번에 수행합니다.

**사용법:**
```bash
# 기본 사용 (patch 버전 업데이트)
pnpm release:pkg @cocrepo/schema

# 버전 타입 지정
pnpm release:pkg @cocrepo/schema patch
pnpm release:pkg @cocrepo/schema minor
pnpm release:pkg @cocrepo/schema major

# 드라이런 모드 (실제 배포 없이 테스트)
pnpm release:pkg @cocrepo/schema patch --dry-run
```

**실행 단계:**
1. 버전 업데이트 (`version-pkg.js` 호출)
2. 패키지 빌드 (`turbo build`)
3. 번들 사이즈 분석 (`analyze-bundle-size.js` 호출)
4. npm 배포 (`pnpm publish`)
5. **Apps 의존성 업데이트 (대화형 모드)** ⭐

### 2. `update-app-deps.js` - Apps 의존성 업데이트

패키지 배포 후 앱들의 의존성을 `workspace:^` 프로토콜로 업데이트합니다.

**사용법:**
```bash
# 대화형 모드 (앱 선택)
pnpm update:app-deps
# 또는
node scripts/update-app-deps.js

# 특정 앱만 업데이트
node scripts/update-app-deps.js server admin
```

**대화형 모드 예시:**
```
📱 업데이트할 앱을 선택해주세요:
============================================================
  admin 업데이트? (y/n) [y]: y
  ✅ admin 선택됨
  server 업데이트? (y/n) [y]: n
  ⏭️  server 건너뜀
  storybook 업데이트? (y/n) [y]: y
  ✅ storybook 선택됨
============================================================

📦 패키지 버전 수집 중...
  ✓ @cocrepo/schema@0.3.7
  ✓ @cocrepo/toolkit@1.3.5

📱 앱 의존성 업데이트 중...
  ✅ admin: @cocrepo/schema workspace:^0.3.0 → workspace:^0.3.0
  ℹ️  admin: @cocrepo/schema 이미 최신 버전 (workspace:^0.3.0)
  💾 admin package.json 업데이트 완료
```

**동작 방식:**
- 패키지 버전 `0.3.7` → 앱 의존성 `workspace:^0.3.0`
- 패키지 버전 `1.4.2` → 앱 의존성 `workspace:^1.4.0`
- 마이너 버전 변경 시에만 업데이트 필요
- 패치 버전은 자동으로 최신 반영

### 3. `version-pkg.js` - 패키지 버전 업데이트

특정 패키지의 버전을 업데이트합니다.

**사용법:**
```bash
node scripts/version-pkg.js @cocrepo/schema patch
node scripts/version-pkg.js @cocrepo/toolkit minor
```

### 4. `analyze-bundle-size.js` - 번들 사이즈 분석

패키지의 빌드 결과물 크기를 분석합니다.

**사용법:**
```bash
node scripts/analyze-bundle-size.js @cocrepo/schema
```

## 🔄 워크플로우

### 전체 패키지 릴리즈 워크플로우

```bash
# 1. 패키지 버전 업데이트 및 빌드
pnpm version:patch  # 또는 minor, major

# 2. 빌드
pnpm build:packages

# 3. 배포
pnpm publish:packages

# 4. Apps 의존성 업데이트 (대화형)
pnpm update:app-deps
```

### 단일 패키지 릴리즈 워크플로우 (권장 ⭐)

```bash
# 한 줄로 모든 과정 수행 (대화형 모드 포함)
pnpm release:pkg @cocrepo/schema patch
```

## 📋 Workspace 프로토콜 이해

### `workspace:^` 프로토콜의 장점

1. **버전 범위 관리**
   - `workspace:^0.3.0` - 0.3.x 버전 자동 업데이트
   - 0.4.0 이상은 수동 업데이트 필요 (breaking change 방지)

2. **Turbo 호환성**
   - Turbo prune이 workspace 의존성으로 인식
   - Docker 빌드 시 필요한 패키지 자동 포함

3. **유연한 배포**
   - 각 앱이 필요한 버전 범위 독립 관리
   - 불필요한 앱 업데이트 방지

### 버전 업데이트 예시

**시나리오 1: 패치 버전 업데이트 (0.3.6 → 0.3.7)**
```bash
pnpm release:pkg @cocrepo/schema patch
```
- Apps: `workspace:^0.3.0` 유지 (업데이트 불필요)
- 자동으로 0.3.7 사용

**시나리오 2: 마이너 버전 업데이트 (0.3.7 → 0.4.0)**
```bash
pnpm release:pkg @cocrepo/schema minor
```
- Apps 대화형 선택:
  - `admin`: 업데이트 (y) → `workspace:^0.4.0`
  - `server`: 건너뜀 (n) → `workspace:^0.3.0` 유지
  - `storybook`: 업데이트 (y) → `workspace:^0.4.0`

**시나리오 3: 메이저 버전 업데이트 (0.4.2 → 1.0.0)**
```bash
pnpm release:pkg @cocrepo/schema major
```
- Apps 대화형 선택 (각각 개별 판단)
- Breaking changes 있으므로 신중한 업데이트

## 🚀 배포 체크리스트

### 배포 전
- [ ] 모든 테스트 통과 (`pnpm test`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] 타입 체크 통과 (`pnpm type-check`)
- [ ] 변경사항 문서화 (CHANGELOG.md)

### 배포 중
- [ ] 올바른 버전 타입 선택 (patch/minor/major)
- [ ] 번들 사이즈 확인
- [ ] 배포 성공 확인

### 배포 후
- [ ] Apps 의존성 업데이트 (대화형 선택)
- [ ] 업데이트된 앱 테스트
- [ ] Git 커밋 및 푸시
- [ ] 릴리즈 노트 작성

## 💡 팁

### 드라이런으로 먼저 테스트
```bash
pnpm release:pkg @cocrepo/schema patch --dry-run
```

### 특정 앱만 업데이트
```bash
# release-pkg.js에서 자동 실행되지 않고 수동 실행
node scripts/update-app-deps.js server
```

### 버전 확인
```bash
pnpm bundle:sizes
```

## ⚠️ 주의사항

1. **Breaking Changes**
   - 메이저 버전 업데이트 시 모든 앱 테스트 필수
   - 의존하는 앱들과 호환성 확인

2. **Workspace 프로토콜**
   - 항상 `workspace:^` 형식 유지
   - 직접 버전 번호 입력 금지

3. **배포 순서**
   - 의존성이 있는 패키지는 순서대로 배포
   - 예: toolkit → schema 순서

4. **Git 커밋**
   - 배포 후 변경된 package.json 반드시 커밋
   - 버전 태그 생성 권장

## 🔧 문제 해결

### "Could not find package" 에러
- `workspace:^` 프로토콜 확인
- `pnpm install` 재실행

### 번들 사이즈 급증
- 불필요한 의존성 확인
- Tree-shaking 설정 확인

### 배포 실패
- npm 로그인 상태 확인
- 패키지 권한 확인
- 네트워크 연결 확인
