# Actions Facade 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-facade/src/action.facade.ts

## 역할

Action 컨트롤러가 직접 들고 있던 시스템 Action 보호 규칙과 DTO 매핑을 Facade로 올립니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| ActionService | Action 조회/생성/수정/삭제 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getActions | group 유무에 따라 전체/그룹별 Action 목록을 반환 |
| getActionById | Action 상세를 조회 |
| createAction | CreateActionDto를 Service 입력으로 매핑 |
| updateAction | 시스템 Action 수정 금지 검증 후 갱신 |
| deleteAction | 시스템 Action 삭제 금지 검증 후 삭제 |

## 비즈니스 규칙

- 시스템 Action(`isSystem=true`)은 수정/삭제할 수 없습니다.
- 컨트롤러는 더 이상 update payload를 조합하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Actions 도메인 thin wrapper facade 신규 생성 | codex |
| 2026-03-13 | ActionFacade boundary 조합을 `@cocrepo/facade`로 이관 | codex |
