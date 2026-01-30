# Agent Orchestration System 기획서

**작성일:** 2026-01-30
**플랫폼:** OpenCode + Claude Code
**버전:** 1.0

---

## 개요

에이전트 오케스트레이션 시스템을 구축하여 복잡한 개발 작업을 자동화합니다.

### 핵심 원칙

```
사용자 요청 → 오케스트레이터 분석 → 에이전트 시퀀스 실행 → 결과 통합
     ↓
에이전트 자동 호출 (Task 도구)
     ↓
프로세스 관리 (상태 추적, 에러 핸들링, 롤백)
     ↓
완성된 산출물 (코드, 문서, 테스트)
```

- **선언적 구성**: 워크플로우 메타데이터로 실행 순서 정의
- **상태 관리**: 각 에이전트 실행 상태를 추적 및 재개
- **에러 핸들링**: 실패 시 자동 롤백 및 재시도
- **멀티 에이전트 동시 실행**: 독립적 에이전트 병렬 처리

---

## 기획 문서 목차

| 파일 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 개요 및 기존 시스템 분석 |
| [02-workflow-interface.md](./02-workflow-interface.md) | 워크플로우 인터페이스 정의 |
| [03-agent-communication.md](./03-agent-communication.md) | 에이전트 간 통신 설계 |
| [04-scenarios.md](./04-scenarios.md) | 사용 예시 및 시나리오 |
| [05-components.md](./05-components.md) | 오케스트레이터 컴포넌트 구조 |
| [06-layout.md](./06-layout.md) | 아키텍처 레이아웃 |
| [07-checklist.md](./07-checklist.md) | 구현 체크리스트 및 참고 자료 |

---

## 기존 시스템 활용

| 컴포넌트 | 위치 | 역할 |
|---------|------|------|
| **Task 도구** | `.claude/agents/orch-*` | 에이전트 호출 기반 |
| **Progress.md** | 각 기획 폴더 | 진행 상황 추적 |
| **L0-L10 레이어** | 요구사항 그래프 | 에이전트 분류 체계 |

---

## 진행 상황

- [ ] 워크플로우 인터페이스 정의
- [ ] 에이전트 통신 시스템 구현
- [ ] 상태 관리 시스템 구현
- [ ] 에러 핸들링 구현
- [ ] 워크플로우 엔진 구현

**상세 진행 상황:** [PROGRESS.md](./PROGRESS.md)

---

## 참고 자료

- [OpenCode Documentation](https://opencode.ai) - Task 도구 사용법
- [Claude Code Documentation](https://docs.anthropic.com) - 에이전트 시스템
- 기존 오케스트레이터: `.claude/agents/orch-requirement.md`
