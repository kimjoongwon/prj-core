# PageTitleBar widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/PageTitleBar/PageTitleBar.tsx

## 역할

이 파일은 widget 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| PageTitleBarProps | 공개 계약 요소 |
| PageTitleBar | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| react | 기능 구현 의존성 |
| ../../display/data-display/Text/Text | 제목/설명 타이포그래피 위계 적용 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. `level`에 따라 시맨틱 heading(`h1`/`h2`)과 시각 variant(`h2`/`h4`)를 결정합니다.
3. 설명은 `subtitle1` 또는 `subtitle2` variant로 렌더링합니다.
4. 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.
- `title`, `description`은 `ReactNode`를 유지하되, 기본 시각 위계는 내부 `Text` primitive가 담당합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `Text` primitive를 사용해 페이지/섹션 제목과 설명에 타이포그래피 위계를 적용 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
