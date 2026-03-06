# StatsCard Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/StatsCard/

## 역할

통계 정보를 카드 형태로 표시합니다. 아이콘, 색상 테마, 증감 표시, 부가 설명을 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 카드 (color=primary)]
┌────────────────────────────────────────┐
│  👥                                    │
│                                        │
│  전체 회원                              │
│  1,284                                 │
│                                        │
│  ↑ 12.5%  지난 달 대비                 │
└────────────────────────────────────────┘

[증가 표시 (change.type=increase)]
│  ↑ +42    이번 주 신규                 │

[감소 표시 (change.type=decrease)]
│  ↓ -8     이번 주 탈퇴                 │

[설명 없음, 아이콘 없음]
┌────────────────────────────────────────┐
│  활성 세션                              │
│  37                                    │
└────────────────────────────────────────┘

[클릭 가능 (onPress 있음)]
┌────────────────────────────────────────┐
│  ⚠️                                    │
│  오류 건수                              │
│  5                                     │
│                           →  상세 보기 │
└────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| default | 회색 테마, 아이콘/값/제목 |
| primary | 파란색 테마 강조 |
| success | 초록색 테마 (정상 상태) |
| warning | 주황색 테마 (주의 상태) |
| danger | 빨간색 테마 (위험 상태) |
| 클릭 가능 | 호버 시 커서 포인터 + 화살표 표시 |
| 증감 표시 | 위/아래 화살표 + 숫자 + 색상 |

## Props

```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: "default" | "primary" | "success" | "warning" | "danger";  // 기본값: "default"
  description?: string;
  change?: { value: number; type: "increase" | "decrease" };
  onPress?: () => void;
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Card/CardBody | 카드 컨테이너 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| icon | 통계 아이콘 (ReactNode) |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
