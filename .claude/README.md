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
 
 - **agents/**: 설계 및 아키텍처 전문가 (fe-*, be-*, etc-* prefix로 분류)
 - **skills/**: 도구 실행 방법 (type-check, lint-format 등)
 - **hooks/**: 자동 실행 스크립트
 
 ## 🚀 사용 방법
 
 프로젝트 루트에서 Claude Code를 실행하면 자동으로 이 설정이 적용됩니다.
 
 ### 에이전트 동기화 (OpenCode ↔ Claude Code)
 
 에이전트 파일을 수정할 때마다 자동으로 Claude Code 형식으로 변환됩니다:
 
 ```bash
 # 에이전트 파일 감시 시작
 pnpm agent:watch
 
 # 또는 수동 변환
 CLAUDE_PROJECT_DIR=$(pwd) bash .claude/hooks/agent-sync.sh
 ```
 
 **변환 흐름:**
 1. OpenCode로 `.claude/agents/*.md` 파일 수정
 2. 감시기가 파일 변경 감지
 3. 자동으로 Claude Code 호환 형식으로 변환
 4. OpenCode와 Claude Code 모두에서 사용 가능
 
 **참고:**
 - `_TEMPLATE.md` 파일은 변환에서 제외
 - 1초 디바운스로 연속 변경 방지
 - Ctrl+C로 감시 중지

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
