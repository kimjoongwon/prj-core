# VariableReadTable Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/VariableReadTable/

## 역할

상세 화면에서 템플릿 변수 목록을 읽기 전용 테이블로 표시합니다. 변수명({{name}} 형식), 설명, 기본값, 필수 여부를 컬럼으로 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌────────────────────────────────────────────────────────────────────────┐
│  변수 목록                                                              │
│                                                                        │
│  ┌──────────────────┬───────────────────┬──────────────┬────────────┐  │
│  │ 변수명           │ 설명              │ 기본값       │ 필수 여부  │  │
│  ├──────────────────┼───────────────────┼──────────────┼────────────┤  │
│  │ {{name}}         │ 수신자 이름       │ -            │ ● 필수     │  │
│  ├──────────────────┼───────────────────┼──────────────┼────────────┤  │
│  │ {{order_id}}     │ 주문 번호         │ ORDER-000    │ ○ 선택     │  │
│  ├──────────────────┼───────────────────┼──────────────┼────────────┤  │
│  │ {{expire_date}}  │ -                 │ -            │ ● 필수     │  │
│  └──────────────────┴───────────────────┴──────────────┴────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

[범례]
 {{name}}   = 변수명을 이중 중괄호로 감싸 표시
 ● 필수     = isRequired: true → HeroUI Chip (danger/primary 계열)
 ○ 선택     = isRequired: false → HeroUI Chip (default 계열)
 -          = null인 경우 대시(-)로 표시
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 4컬럼 읽기 전용 테이블 |
| 필수 배지 | `● 필수` Chip (색상 강조) |
| 선택 배지 | `○ 선택` Chip (회색 계열) |
| 빈 상태 | 변수 없음 안내 메시지 표시 |

## Props

```typescript
interface VariableReadTableProps {
  variables: TemplateVariable[];
}

interface TemplateVariable {
  id: string;
  name: string;
  description: string | null;
  defaultValue: string | null;
  isRequired: boolean;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table | 테이블 컨테이너 |
| HeroUI Chip | 필수/선택 배지 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
