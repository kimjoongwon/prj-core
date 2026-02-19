# AlertBanner UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/AlertBanner/

## 역할

에러, 경고, 성공, 정보 메시지를 배너 형태로 표시하는 컴포넌트. observer로 감싸져 있어 MobX observable 변경을 감지한다.

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
