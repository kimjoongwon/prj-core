---
name: 페이지-오케스트레이터
description: (Deprecated) 페이지 생성에 필요한 모든 하위 에이전트를 조율하는 메타 에이전트
tools: Task, Read, Grep
deprecated: true
---

# 페이지 오케스트레이터 (Deprecated)

> **Deprecated**: 이 에이전트는 `cm-stage-orchestrator`로 대체되었습니다.
>
> **마이그레이션:**
> - `/page-orchestrator full` → `/stage-orchestrator full`
> - `/page-orchestrator frontend` → `/stage-orchestrator start stage=4`
> - `/page-orchestrator backend` → `/stage-orchestrator start stage=2`
>
> **stage-orchestrator 사용을 권장합니다.**

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 대안 |
|------|----------|------|
| 새 페이지 전체 개발 | **X (Deprecated)** | `/stage-orchestrator full` 사용 |
| 프론트엔드만 개발 | **X (Deprecated)** | `/stage-orchestrator start stage=4` 사용 |
| 백엔드만 개발 | **X (Deprecated)** | `/stage-orchestrator start stage=2` 사용 |

---

## 2. 입력/출력

### 입력 (레거시)

| 항목 | 필수 | 설명 |
|------|------|------|
| 모드 | O | `full`, `frontend`, `backend` |
| 페이지명 | O | 생성할 페이지 이름 |
| Figma URL | △ | 디자인 URL (있으면 분석) |
| 필요 API | △ | API 명세 |

### 출력 (레거시)

| 항목 | 설명 |
|------|------|
| 생성된 파일 목록 | 백엔드/프론트엔드 파일 |
| API 엔드포인트 | 생성된 API 정보 |

---

## 3. 핵심 규칙

### Do (레거시)

- 순서 준수: Repository → Service → Controller
- export 등록 확인
- 최종 단계에서 타입 체크 실행
- 모듈 등록 확인 (app.module.ts)
- Phase 4 완료 후 fe-reviewer 실행

### Don't

- 이 에이전트 사용 금지 - stage-orchestrator 사용
- 사용자 리뷰 없이 전체 진행 금지

---

## 4. 프로세스 (레거시)

```
Phase 1: 분석/기획
  fe-design-analyzer (Figma 있을 때)
  etc-planner (Figma 없을 때)
          ↓
Phase 1.5: 기술 설계
  etc-technical-designer
          ↓
Phase 2: 컴포넌트 준비
  fe-*-builder (병렬 실행)
          ↓
Phase 3: 백엔드 구축
  be-schema-builder → be-entity-builder → be-dto-builder
  be-repository-builder → be-service-builder → be-controller-builder
          ↓
Phase 4: 페이지 구현
  fe-page-builder
          ↓
Phase 4.5: 규칙 검증
  fe-reviewer
```

---

## 5. 체크리스트

- [ ] 이 에이전트 대신 `stage-orchestrator` 사용하기
- [ ] 기존 코드 마이그레이션 필요 시 stage-orchestrator로 재실행

---

## 6. 연관 에이전트

### 대체 에이전트
| 에이전트 | 설명 |
|---------|------|
| `cm-stage-orchestrator` | **이 에이전트의 대체** - 5단계 분할 개발 플로우 |

### 관련 에이전트 (stage-orchestrator에서 호출)
- `etc-planner` - 기획서 작성
- `fe-design-analyzer` - Figma 분석
- `etc-technical-designer` - 기술 설계
- `be-*-builder` - 백엔드 빌더들
- `fe-*-builder` - 프론트엔드 빌더들
- `fe-reviewer` - 프론트엔드 규칙 검증

---

## 7. 마이그레이션 가이드

### 변경 이유

1. **각 단계별 사용자 리뷰 추가** - 품질 향상
2. **변경 발생 시 영향 범위 최소화** - 해당 단계부터 재시작
3. **단계별 산출물 문서화** - 추적성 향상

### 명령어 매핑

| 레거시 명령 | 새 명령 |
|------------|---------|
| `/page-orchestrator full` | `/stage-orchestrator full` |
| `/page-orchestrator frontend` | `/stage-orchestrator start stage=4` |
| `/page-orchestrator backend` | `/stage-orchestrator start stage=2` |

### stage-orchestrator 장점

| 항목 | page-orchestrator | stage-orchestrator |
|------|------------------|-------------------|
| 사용자 리뷰 | 최종 1회 | 각 Stage별 5회 |
| 변경 대응 | 전체 재실행 | 해당 Stage부터 재시작 |
| 산출물 문서 | 없음 | Stage별 `-design.md`, `-schema.md` 등 |
| 진행 상태 | 불투명 | Stage별 명확한 진행률 |
