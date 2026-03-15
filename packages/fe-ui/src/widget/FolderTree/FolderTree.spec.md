# FolderTree widget 기획서

> 생성일: 2026-03-15
> 타입: widget
> 위치: packages/fe-ui/src/widget/FolderTree/FolderTree.tsx

## 역할

이 파일은 widget 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목            | 설명           |
| --------------- | -------------- |
| FolderTreeItem  | 공개 계약 요소 |
| FolderTreeProps | 공개 계약 요소 |
| FolderTree      | 공개 계약 요소 |

## 의존성

| 모듈            | 용도                         |
| --------------- | ---------------------------- |
| @heroui/react   | 버튼/스피너와 className 조합 |
| lucide-react    | 폴더/확장 아이콘             |
| mobx-react-lite | observer 래핑                |
| react           | 내부 확장 상태 동기화        |

## 동작 흐름

1. flat folder 목록을 트리 구조로 재조합합니다.
2. 선택된 폴더의 조상 노드를 자동 확장해 현재 위치를 드러냅니다.
3. 루트 선택, 폴더 선택, 확장/축소 액션을 외부로 전달합니다.
4. 선택된 폴더가 있을 때 header에서 rename/delete action을 노출할 수 있습니다.

## 실패 및 엣지 케이스

- 폴더가 비어 있으면 빈 상태 메시지를 렌더링합니다.
- 부모 폴더를 찾을 수 없는 노드는 루트 레벨로 승격해 렌더링합니다.
- create/rename/delete 버튼은 hook만 제공하고 실제 modal/CRUD는 상위 Feature가 담당합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자       | 내용                                                                                               | 작성자 |
| ---------- | -------------------------------------------------------------------------------------------------- | ------ |
| 2026-03-15 | selected folder 기준 rename/delete header action hook을 추가해 assets 페이지 폴더 관리 범위를 확장 | codex  |
| 2026-03-15 | assets 목록 좌측 사이드바를 위한 FolderTree 위젯 구현 추가                                         | codex  |
