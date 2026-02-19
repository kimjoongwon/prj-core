# HeaderSpaceSelector Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/HeaderSpaceSelector/

## 역할

헤더 영역에서 Space(테넌트)를 선택할 수 있는 Feature 컴포넌트입니다.
SpaceSelectorDropdown Widget을 래핑하여, 사용하는 앱에서 Store를 props로 주입하는 방식으로 동작합니다.
Store에 직접 의존하지 않고 props를 통해 데이터와 핸들러를 받습니다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
