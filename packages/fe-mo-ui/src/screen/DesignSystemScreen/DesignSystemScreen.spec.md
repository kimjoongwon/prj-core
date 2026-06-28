# DesignSystemScreen

## 목적

현재 mobile/Expo Web 디자인시스템의 표면, 리듬, 상태 컴포넌트를 탭으로 나누어 수정 전 기준점을 만든다.

## Props 계약

| prop | type | 설명 |
| --- | --- | --- |
| `activeTab` | `"overview" \| "foundations" \| "components" \| "patterns" \| "audit"` | Storybook 또는 route가 선택한 현재 탭 |
| `onChangeTab` | `(tabId) => void` | 탭 변경 요청 핸들러 |

- Screen은 spec 파일을 읽지 않는다.
- 모바일 Screen은 native 환경도 고려해 URL API를 직접 사용하지 않는다.
- 앱 route와 public export는 추가하지 않는다.

## 탭 구성

| 탭 | 조합 |
| --- | --- |
| Overview | `ScreenFrame`, summary metric, `ListGroup` |
| Foundations | `Surface`, `Card`, `Text/Typography` |
| Components | `Button`, `SearchField`, `Input`, `Chip`, `StatusFeedback`, `Skeleton` |
| Patterns | mobile screen composition |
| Audit | mobile surface/action/input density risk |

## 화면 스케치

```text
DesignSystemScreen
└─ ScreenFrame
   └─ ScrollView
      ├─ Title / status chips
      ├─ horizontal tablist
      ├─ active tab panel
      │  ├─ Overview
      │  ├─ Foundations
      │  ├─ Components
      │  ├─ Patterns
      │  └─ Audit
      └─ ScreenActionBar
```
