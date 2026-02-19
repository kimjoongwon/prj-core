# AlertBanner UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/AlertBanner/

## 역할

에러, 경고, 성공, 정보 메시지를 배너 형태로 표시하는 컴포넌트. observer로 감싸져 있어 MobX observable 변경을 감지한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[title 있음 - danger 타입]
┌─────────────────────────────────────────────────┐
│ 🔴  오류가 발생했습니다                          │  ← title (굵게)
│     서버 응답 시간이 초과되었습니다.              │  ← message
│     [재시도]  [닫기]                             │  ← actions (옵션)
└─────────────────────────────────────────────────┘
  배경: bg-danger/20 | 테두리: border-danger/50

[title 없음 - warning 타입 (인라인)]
┌─────────────────────────────────────────────────┐
│ ⚠️  변경사항이 저장되지 않았습니다.              │
└─────────────────────────────────────────────────┘
  배경: bg-warning/20 | 테두리: border-warning/50

[success 타입]
┌─────────────────────────────────────────────────┐
│ ✅  저장 완료                                    │
│     데이터가 성공적으로 저장되었습니다.           │
└─────────────────────────────────────────────────┘
  배경: bg-success/20 | 테두리: border-success/50

[info 타입]
┌─────────────────────────────────────────────────┐
│ ℹ️  알림                                         │
│     이 기능은 관리자 권한이 필요합니다.           │
└─────────────────────────────────────────────────┘
  배경: bg-primary/20 | 테두리: border-primary/50
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| danger | 빨간 배경/테두리, 빨간 텍스트, 🔴 아이콘 |
| warning | 노란 배경/테두리, 노란 텍스트, ⚠️ 아이콘 |
| success | 초록 배경/테두리, 초록 텍스트, ✅ 아이콘 |
| info | 파란 배경/테두리, 파란 텍스트, ℹ️ 아이콘 |

## Props

```typescript
type AlertBannerType = "danger" | "warning" | "success" | "info";

interface AlertBannerProps {
  /** 배너 타입 */
  type: AlertBannerType;
  /** 제목 (굵은 텍스트) */
  title?: string;
  /** 메시지 내용 */
  message: ReactNode;
  /** 추가 액션 영역 */
  actions?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 변형 (Variants)

| 타입 | 배경 | 테두리 | 텍스트 |
|------|------|--------|--------|
| danger | bg-danger/20 | border-danger/50 | text-danger |
| warning | bg-warning/20 | border-warning/50 | text-warning |
| success | bg-success/20 | border-success/50 | text-success |
| info | bg-primary/20 | border-primary/50 | text-primary |

## 상태

| 상태 | 동작 |
|------|------|
| title 있음 | 제목 + 메시지 2단 구조 |
| title 없음 | 아이콘 + 메시지 1단 인라인 |
| actions 있음 | 하단에 액션 영역 추가 |

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). SVG 아이콘 인라인.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
