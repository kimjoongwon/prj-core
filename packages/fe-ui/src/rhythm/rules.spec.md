# rhythm rules 기획서

> 생성일: 2026-03-26
> 타입: rhythm
> 위치: packages/fe-ui/src/rhythm/

## 역할

`rhythm` 레이어를 단순 폴더가 아니라 spacing 규칙 레이어로 운영하기 위한 사용 규칙을 정의합니다.

## 사용 규칙

- 신규 `VStack`/`HStack`/`Spacer` 호출은 raw number보다 semantic preset을 우선 사용합니다.
- 권장 매핑:
  - `page`: 페이지의 주요 블록 간 간격
  - `section`: 섹션 내부 기본 수직 리듬
  - `block`: 제목-본문, 카드 내부 보조 블록
  - `inline`: 버튼 행, 짧은 액션 묶음, 짧은 수평 그룹
  - `dense`: 메타데이터, 보조 캡션, 촘촘한 리스트
  - `roomy`: 빈 상태, 로그인/로딩, 강조 카드
  - `flush`: 추가 간격 없음
- raw numeric gap/size는 기존 화면 parity 유지나 예외적인 미세 조정에서만 허용합니다.
- 새로운 pure page/widget/feature 조합에서는 `space-y-*`, `space-x-*`, 수동 `gap-*`보다 rhythm primitive를 우선 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | semantic rhythm preset 중심 사용 규칙 추가 | codex |
