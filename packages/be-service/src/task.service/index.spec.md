# Tasks Service 기획서

> 생성일: 2026-03-11
> 타입: service
> 위치: packages/be-service/src/task.service/index.ts

## 역할

Task aggregate root 기준 비즈니스 로직을 처리합니다. Exercise detail은 Task root 내부에서만 생성/수정/삭제합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Task root service 신규 생성 | codex |
| 2026-03-13 | `task.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
