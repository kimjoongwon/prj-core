# dto-exclude-presets dto 기획서

> 생성일: 2026-03-03
> 타입: dto
> 위치: packages/be-dto/src/dto-exclude-presets.ts

## 역할

이 파일은 dto 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| ActionExcludePresets | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| ./action.dto | 기능 구현 의존성 |

## 주요 규칙

- `ActionExcludePresets.LIST`는 Action 목록 그리드가 사용하는 `isSystem`을 제외하지 않습니다.
- `ActionExcludePresets.SUMMARY`만 시스템 여부를 포함하지 않는 요약 응답 용도로 유지합니다.

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | Action 목록 응답에서 시스템 여부 컬럼을 렌더링할 수 있도록 `LIST` preset에서 `isSystem` 제외를 제거 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
