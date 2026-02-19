# SpaceSelector Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/SpaceSelector/

## 역할

Header의 right 영역에서 현재 Space를 표시하고 드롭다운으로 변경할 수 있는 Feature 컴포넌트입니다.
PersistStore에서 현재 Space 정보와 Space 목록을 가져와 렌더링합니다.
Space가 1개뿐이면 드롭다운 없이 정적으로 표시하고, 여러 개면 Dropdown으로 전환할 수 있습니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `usePersistStore` | 현재 Space 정보 및 Space 목록 |
| UI Library | `@heroui/react` > `Avatar`, `Button`, `Dropdown`, `DropdownItem`, `DropdownMenu`, `DropdownTrigger` | 드롭다운 UI |
| Util | `iconUtils` > `renderLucideIcon` | Lucide 아이콘 렌더링 |

## Props

```typescript
interface SpaceSelectorProps {
  /** Space 변경 시 콜백 (API 호출 등) */
  onChangeSpace?: (spaceId: string, groundName: string) => void;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| PersistStore | `spaceId` | 현재 선택된 Space ID |
| PersistStore | `groundName` | 현재 선택된 Space 이름 |
| PersistStore | `spaces` | 선택 가능한 Space 목록 |
| PersistStore | `setSpace(spaceId, groundName)` | Space 변경 시 영속 데이터 업데이트 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onChangeSpace` | 다른 Space 선택 시 | spaceId, groundName 전달 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Dropdown` / `DropdownMenu` | HeroUI | Space 선택 드롭다운 |
| `Avatar` | HeroUI | Space 아이콘 (Building2) |
| `Button` | HeroUI | 드롭다운 트리거 버튼 |

## 구현 체크리스트

- [x] SpaceSelector.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] Hydration 대응 (useState + useEffect)
- [x] 단일 Space 시 드롭다운 미표시 처리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
