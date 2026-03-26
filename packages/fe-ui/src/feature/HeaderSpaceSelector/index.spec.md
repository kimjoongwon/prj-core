# HeaderSpaceSelector Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/HeaderSpaceSelector/

## 역할

헤더 영역에서 Space(테넌트)를 선택할 수 있는 Feature 컴포넌트입니다.
SpaceSelectorDropdown Widget을 래핑하여, 사용하는 앱에서 Store를 props로 주입하는 방식으로 동작합니다.
Store에 직접 의존하지 않고 props를 통해 데이터와 핸들러를 받습니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
 헤더 내 HeaderSpaceSelector 위치
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
│  [Logo]    [Nav 메뉴]    [SpaceSelector ▼]   [UserMenu 👤]  │
└──────────────────────────────────────────────────────────────┘

 SpaceSelectorDropdown (닫힌 상태)
┌────────────────────────────────┐
│  🏢 현재 Space 이름        ▼  │
└────────────────────────────────┘

 SpaceSelectorDropdown (열린 상태)
┌────────────────────────────────┐
│  🏢 현재 Space 이름        ▼  │
├────────────────────────────────┤
│  🏢 Space A                [✓]│
│  🏢 Space B                   │
│  🏢 Space C                   │
│  🏢 Space D                   │
└────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 현재 Space 표시 | 드롭다운 트리거 버튼에 현재 Space 이름 표시 |
| 드롭다운 열림 | 트리거 버튼 클릭 시 | Space 목록 드롭다운 팝업 표시 |
| Space 선택 | 목록에서 항목 선택 시 | 선택된 항목에 체크, onSpaceSelect 콜백 발생 |
| currentSpaceId 없음 | 초기 로드 전 | 빈 상태 또는 placeholder 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Widget | `SpaceSelectorDropdown` | Space 선택 드롭다운 UI |

## Props

```typescript
interface HeaderSpaceSelectorProps {
  /** 선택 가능한 Space 목록 */
  spaces: SpaceInfo[];
  /** 현재 선택된 Space ID */
  currentSpaceId: string | null;
  /** 현재 선택된 Space 이름 */
  currentSpaceName: string | null;
  /** Space 선택 핸들러 */
  onSpaceSelect: (space: SpaceInfo) => void;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | 앱에서 PersistStore를 통해 props로 주입 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onSpaceSelect` | 드롭다운에서 Space 선택 시 | 선택된 SpaceInfo 객체 전달 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `SpaceSelectorDropdown` | Widget | Space 목록 드롭다운 UI 렌더링 |

## 구현 체크리스트

- [x] HeaderSpaceSelector.tsx
- [x] types.ts (Props, SpaceInfo 타입)
- [x] index.ts (re-export)
- [x] observer 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-13 | API 의존을 root barrel에서 split subpath import로 전환 | codex |
