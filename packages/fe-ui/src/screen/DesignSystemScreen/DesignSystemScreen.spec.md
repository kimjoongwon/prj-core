# DesignSystemScreen

## 목적

현재 web/admin 디자인시스템의 표면, 리듬, 상태 컴포넌트를 탭으로 나누어 수정 전 기준점을 만든다.

## Props 계약

| prop | type | 설명 |
| --- | --- | --- |
| `activeTab` | `"overview" \| "foundations" \| "components" \| "patterns" \| "audit"` | Storybook 또는 route가 선택한 현재 탭 |
| `onChangeTab` | `(tabId) => void` | 탭 변경 요청 핸들러 |

- Screen은 spec 파일을 읽지 않는다.
- Storybook wrapper가 `ds-tab` querystring을 읽고 `activeTab`으로 전달한다.
- 앱 route와 public export는 추가하지 않는다.

## 탭 구성

| 탭 | 조합 |
| --- | --- |
| Overview | `PageTitleBar`, `StatsCard`, screen map |
| Foundations | `ScreenSurface`, `layout/Section`, `Surface`, color/type rhythm |
| Components | `Button`, `Input`, `Chip`, `Badge`, `DataGrid`, `Table`, `Alert`, `Spinner`, `Skeleton` |
| Patterns | admin list/detail/form composition |
| Audit | `UserListScreen` 계열 직접 배경/밀도 override 추적 |

## 화면 러프

```text
DesignSystemScreen
└─ ScreenSurface
   ├─ PageTitleBar + summary rail
   ├─ tablist (?ds-tab=overview|foundations|components|patterns|audit)
   └─ tabpanel
      ├─ Overview: admin screen map
      ├─ Foundations: surface / color / typography
      ├─ Components: controls / data display / feedback
      ├─ Patterns: screen composition
      └─ Audit: current admin overrides
```
