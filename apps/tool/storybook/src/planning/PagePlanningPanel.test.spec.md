# PagePlanningPanel.test.tsx Spec

## 목적
- page planning panel의 기본 렌더링과 Codex bridge 상태별 안내 문구가 기대대로 보이는지 검증합니다.

## 핵심 동작
- summary/raw/board/compact variant가 모두 현재 story에 맞는 planning 문서를 표시하는지 검증합니다.
- `Codex로 수정` dialog가 연결된 spec 경로를 표시하는지 검증합니다.
- Codex bridge가 404를 반환하면 `endpoint 없음` 복구 문구를 노출하는지 검증합니다.
- Codex bridge가 HTML을 반환하면 로그인/리다이렉트 가능성을 안내하는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Codex bridge 404/HTML 응답 안내 회귀와 panel variant 동작을 문서화하는 test sidecar 신규 추가 | codex |
