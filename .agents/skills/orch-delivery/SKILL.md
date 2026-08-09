---
name: orch-delivery
description: 여러 owner가 참여하는 delivery 작업에서 현재 Codex가 얕은 루트로서 worker를 분할·호출하고 간결한 결과를 연결할 때 사용합니다.
---

# Orch Delivery

현재 이 skill을 적용한 Codex를 실행의 루트로 취급합니다. 이 skill 자체나 별도의 `orch-delivery` custom agent를 실행 주체로 가정하지 않습니다.

## 책임

- 사용자 요청을 owner 단위의 완결 가능한 작업으로 나눕니다.
- custom agent의 짧은 `description`으로 담당 worker를 선택합니다.
- 선행 관계와 수정 범위 충돌을 확인합니다.
- 독립 작업을 병렬 호출하고 같은 batch의 모든 결과를 기다립니다.
- 완료된 산출물의 소비 정보만 후속 worker에 전달합니다.
- Worker 최종 보고와 검증 근거로 성공, 재작업과 중단을 판단합니다.

제품 구현과 상세 저장소 탐색은 담당 worker가 소유합니다. 루트는 worker의 `SKILL.md`를 대신 수행하거나 구현 세부를 prompt에 복사하지 않습니다.

## 공식 기능 경계

- Skill은 Codex가 따르는 지침이며 독립 실행 프로세스가 아닙니다.
- Custom agent와 skill의 연결은 `developer_instructions`이며 runtime binding이 아닙니다.
- Subagent 입력과 결과는 일반 텍스트 메시지입니다.
- Codex가 subagent의 spawn, wait, steer와 close를 수행합니다.
- Worker는 다른 custom agent나 subagent를 호출하지 않습니다.
- Codex 런타임의 완료 상태와 프로젝트 작업 결과를 분리합니다.

## 작업 분할

하나의 worker는 같은 ownership의 탐색, 구현, 연결과 기본 검증을 한 번에 완결합니다. 파일 생성, wiring, export와 테스트를 같은 owner 안에서 미세 agent로 나누지 않습니다.

다른 owner의 선행 산출물이 필요한 경우에만 별도 작업으로 분리합니다. 예를 들어 공용 schema가 없는 Form 완성 요청은 다음 owner 순서를 사용합니다.

```text
common-schema-builder
  -> schema 경로, export, 용도와 검증 반환
fe-form-agent
  -> 해당 schema를 직접 읽고 Form 구현·연결·검증
```

명시적으로 하나의 custom agent만 요청한 경우 다른 worker를 자동 호출하지 않습니다. 해당 worker가 필수 입력 부재를 `입력 필요`로 보고하면 루트가 그 결과를 사용자에게 전달합니다.

## Worker 작업 메시지

루트는 별도 생성 도구 없이 다음 항목으로 일반 Markdown 메시지를 작성합니다.

```markdown
## 작업 목표
완결해야 할 owner 단위 작업

## 수정 범위
변경할 수 있는 ownership과 대상

## 사용자 결정
사용자가 명시한 UX 또는 업무 정책

## 선행 산출물
이전 worker가 만든 경로, export 또는 계약, 용도와 검증 결과

## 추가 완료 기준
담당 skill의 기본 검증 외 조건

## 최종 응답
공통 Worker 최종 보고 계약에 따라 간결하게 반환
```

루트가 모르는 모델, schema, 타입, 기존 구현과 테스트 경로는 worker가 저장소에서 직접 찾습니다. 이전 worker의 응답 전체나 source code를 다음 메시지에 복사하지 않습니다.

## 병렬 실행과 대기

- 수정 범위가 독립적인 write 작업은 기본 최대 4개까지 병렬 실행합니다.
- read-only 탐색과 분석은 최대 8개까지 병렬 실행할 수 있습니다.
- 설정된 동시 thread 수는 기술적 상한이며 실행 목표가 아닙니다.
- 같은 파일이나 공개 export를 수정하는 작업은 직렬화합니다.
- 같은 batch의 worker를 모두 spawn한 뒤 모든 결과를 기다립니다.
- 하나의 결과가 먼저 도착해도 batch 판정 전에는 다음 의존 작업을 시작하지 않습니다.
- 직렬 의존 작업은 병렬화하지 않습니다.

## 결과 capsule

Worker 최종 메시지에서 후속 작업에 필요한 내용만 추출합니다.

```markdown
## 선행 산출물
- 경로: 실제 산출물 경로
- export 또는 계약: 후속 작업이 소비할 공개 이름
- 용도: 소비 목적
- 검증: 실행 명령과 결과
```

여러 worker의 결과를 사용자에게 그대로 반복하지 않고 다음 통합 표로 정리합니다.

| owner | 결과 | 핵심 산출물 | 검증 |
|---|---|---|---|

## 결과 판정

- `완료`: 산출물과 skill 기본 검증 및 추가 완료 기준이 충족된 경우
- `입력 필요`: 구현 전에 다른 owner 산출물이나 사용자 결정이 없어 변경 없이 종료한 경우
- `검증 실패`: 구현했지만 완료 기준을 통과하지 못한 경우
- runtime 오류: agent turn 자체가 정상 종료하지 못한 경우

Runtime `Completed`여도 worker 결과가 `입력 필요`나 `검증 실패`이면 프로젝트 작업은 완료가 아닙니다. 실패 결과에 의존하는 worker는 실행하지 않습니다. 재작업은 같은 owner에게 핵심 실패 원인과 재현 명령만 전달합니다.

## 통합 검증과 최종 보고

모든 worker가 완료된 뒤 루트가 전체 통합 검증을 한 번 수행합니다. Worker별 검증을 반복하지 않고 계약 충돌이나 불일치가 의심되는 대상만 추가 확인합니다.

최종 보고에는 완료한 owner, 핵심 산출물, 통합 검증 결과, 실행하지 못한 작업과 남은 위험만 포함합니다. Raw Hook log나 worker 상세 transcript는 사용자가 분석을 요청하지 않는 한 읽거나 최종 응답에 포함하지 않습니다.
