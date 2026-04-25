# SelectInput feature 기획서

> 생성일: 2026-03-03
> 타입: feature
> 위치: packages/fe-ui/src/master/table/MetaDataGrid/SelectInput.tsx

## 역할

이 파일은 feature 계층의 핵심 동작을 담당합니다.
select filter 값을 `MetaDataGridState`의 query slice에서 읽고, 선택 변경 시 page-owned query state에 즉시 반영합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| SelectInput | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 동작 흐름

1. `state.query.values[queryKey]`를 읽어 selectedKeys를 계산합니다.
2. 사용자가 option을 선택하면 `state.query.setValues`로 필터 값과 `skip: 0`을 commit합니다.
3. 필터 option은 InputConfig props의 options를 사용합니다.
4. `placement: "column-header"`이면 컬럼 헤더 안에 맞는 compact height로 렌더링합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | column-header placement compact 렌더링을 추가 | codex |
| 2026-04-25 | SelectInput이 MetaDataGridState query를 소비하고 선택 변경 시 첫 페이지로 reset하도록 변경 | codex |
| 2026-04-24 | MetaDataGrid가 page-owned query state props를 소비하도록 정리 | codex |
| 2026-03-23 | nuqs bridge 의존을 제거하고 page-owned query state props를 소비하도록 정리 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
