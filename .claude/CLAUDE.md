# 프로젝트 개발 가이드

## 프론트엔드 개발 규칙

### 컴포넌트 작성

- ui 컴포넌트를 만들 때는 mobx를 사용합니다
- **이벤트 핸들러 네이밍 규칙**:
  - **일반 컴포넌트**: `handle` 접두어 사용 (예: `handleClick`, `handleChange`)
  - **Page 컴포넌트**: `on[Event][UI]` 형태로 직관적 표현 (예: `onClickLoginButton`, `onChangeEmail`)
    - Page는 직관적이어야 하므로 어떤 UI를 눌렀는지 명확히 드러나야 함
- 컴포넌트 내에서 함수를 인라인으로 선언하지 않습니다

### 텍스트 처리

- 모든 컴포넌트의 텍스트는 components 폴더의 Text 컴포넌트로 감싸서 사용합니다

## 테스트 작성 규칙

- 테스트 코드의 설명(describe, it)은 한글로 작성합니다
- 테스트는 Given-When-Then 패턴을 따릅니다

## 코드 품질 검사

### TypeScript 타입 체킹

자세한 실행 방법 및 규칙은 [type-check skill](./skills/type-check/SKILL.md)을 참고하세요.

### 린트 & 포맷 체킹

자세한 실행 방법 및 규칙은 [lint-format skill](./skills/lint-format/SKILL.md)을 참고하세요.

## 커밋 메시지 규칙

```
<타입>(<범위>): <제목>

<본문>

<푸터>
```

### 타입

- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 추가/수정
- chore: 빌드 작업, 패키지 매니저 설정 등

### 예시

```
feat(coin): 멀티시그 지갑 서비스 초기 구현

- 지갑 생성 API 추가
- 트랜잭션 승인 로직 구현
- 테스트 코드 작성
```

## Agent 활용 가이드

### 사용 가능한 Agent

- **design-analyzer**: Figma 디자인 분석 및 컴포넌트 매핑
- **component-builder**: 재사용 가능한 UI 컴포넌트 생성
- **backend-architect**: NestJS API 설계
- **frontend-architect**: React 컴포넌트 아키텍처 설계
- **database-expert**: Prisma 스키마 설계 및 최적화
- **code-reviewer**: 코드 리뷰 및 개선 제안
- **refactoring-expert**: 코드 리팩토링
- **test-engineer**: 테스트 코드 작성
- **performance-optimizer**: 성능 최적화
- **security-auditor**: 보안 취약점 분석
- **devops-engineer**: 배포 및 인프라 설정

각 Agent의 상세 역할은 `.claude/agents/` 디렉토리를 참고하세요.
