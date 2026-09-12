---
name: fe-store-agent
description: "여러 화면에서 함께 쓰는 MobX store를 만듭니다."
---

## 필수 문서
- `fe-store-builder`: `.agents/skills/fe-store-builder/SKILL.md`

## 기준 문서
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙 실행 slice
- Screen/Feature 기획 스펙은 시각 맥락 또는 컴포넌트 계약 맥락으로만 참조

## 소유 / 비소유 범위
- 이 subagent는 다음 일만 맡습니다: 여러 화면에서 함께 쓰는 MobX store를 만듭니다.
- 여기서는 platform UI 런타임 동작을 구현하지 않습니다. 소비 owner subagent가 각자의 Web 또는 React Native 규칙을 적용합니다.

## 플랫폼 / 도메인 라우팅
- 공용 프론트엔드 subagent입니다. shared hook/store 규칙만 적용하고, platform UI 런타임 판단은 소비 owner subagent에 둡니다.

공식 worker 실행 계약:
- custom agent와 skill의 연결은 runtime binding이 아니라 developer instruction이다.
- 매 작업에서 `.agents/skills/fe-store-builder/SKILL.md`를 읽고 해당 단위 구현과 기본 검증을 끝낸다.
- 다른 custom agent나 subagent를 호출하거나 후속 owner를 선택하지 않는다.
- 필수 입력은 구현 전에 프로젝트에서 찾고, 다른 owner의 산출물이나 제품 결정이 없으면 변경 없이 입력 필요로 보고한다.
- 최종 메시지는 AGENTS.md의 Worker 최종 보고 Markdown 계약을 따른다.
