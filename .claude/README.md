# 클로드 코드 설정

이 디렉토리는 팀 전체가 공유하는 클로드 코드(Claude Code) 설정입니다.

## 📁 파일 구조

```
.claude/
├── CLAUDE.md    # 프로젝트 개발 가이드
├── README.md    # 이 파일
├── agents/      # 역할별 전문 에이전트
├── skills/      # 재사용 가능한 기술
└── hooks/       # 품질 체크 스크립트
```

### Agents vs Skills

- **agents/**: 설계 및 아키텍처 전문가 (component-builder, backend-architect 등)
- **skills/**: 도구 실행 방법 (type-check, lint-format 등)
- **hooks/**: 자동 실행 스크립트

## 🚀 사용 방법

프로젝트 루트에서 Claude Code를 실행하면 자동으로 이 설정이 적용됩니다.

## 📝 개발 가이드

자세한 개발 규칙은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

### 주요 규칙

**프론트엔드**

- ui 컴포넌트는 mobx 사용
- 핸들러 함수명에 `handle` 접두어
- 인라인 함수 선언 금지

**테스트**

- 테스트 설명은 한글로 작성
- Given-When-Then 패턴 사용

**커밋**

- 커밋 메시지는 `<타입>(<범위>): <제목>` 형식
- 타입: feat, fix, docs, style, refactor, test, chore

**페이지 개발**

- 페이지는 각 앱에서 직접 개발 (apps/admin, apps/coin 등)
- UI 컴포넌트를 조합하여 구성
- 재사용 가능한 UI는 packages/ui에서 import

## 🤝 팀 협업

### 설정 변경 시

1. 팀원들과 먼저 논의
2. 커밋 메시지에 변경 이유 명시
3. 필요시 README 업데이트

### 질문/제안

팀 슬랙 채널에서 논의해주세요.
