# AuthCard Widget 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AuthCard/

## 역할

인증 페이지(로그인, 회원가입 등)용 카드 래퍼. 배경 블러 오브 + 중앙 정렬 카드 + 푸터를 포함한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[primary 변형 - 로그인 페이지 예시]
┌──────────────────────────────────────────────────┐
│                                                  │
│  ░░░░░░░░░░░░░░░░░                               │  ← 좌하단 블러 오브 (bg-primary/30)
│                                                  │
│          ┌─────────────────────────┐             │
│          │  ┌───┐                  │             │
│          │  │ ◆ │  관리자 로그인    │             │  ← AuthCardHeader (아이콘 + 제목)
│          │  └───┘  계정으로 로그인  │             │    + 부제목
│          │─────────────────────────│             │
│          │                         │             │
│          │  [이메일 입력 필드]      │             │  ← children (폼 등)
│          │  [비밀번호 입력 필드]    │             │
│          │                         │             │
│          │  [        로그인        ]│             │
│          └─────────────────────────┘             │
│                                                  │
│                               ░░░░░░░░░░░░░░░   │  ← 우상단 블러 오브 (bg-secondary/20)
└──────────────────────────────────────────────────┘
  전체 화면 중앙 정렬 (min-h-screen)

[danger 변형 - 경고성 인증 화면]
  좌하단 블러 오브: bg-danger/20 (빨간 계열)
  나머지 구조 동일

[AuthCardHeader - 로고 이미지 사용]
│          │  [LOGO IMG]             │
│          │  서비스명               │  ← title
│          │  로그인하여 시작하세요   │  ← subtitle
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| primary (기본) | 파란 계열 블러 오브 배경 + 중앙 카드 |
| danger | 빨간 계열 블러 오브 배경 + 중앙 카드 |
| 아이콘 헤더 | 그라데이션 아이콘 + 제목 + 부제목 |
| 로고 헤더 | 로고 이미지 + 제목 + 부제목 |

## 하위 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| AuthCard | AuthCard.tsx | 배경 오브 + 중앙 카드 래퍼 |
| AuthCardHeader | AuthCardHeader.tsx | 아이콘/로고 + 제목 + 부제목 영역 |

### AuthCard Props

```typescript
interface AuthCardProps {
  /** 카드 내부 콘텐츠 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 배경 오브 색상 변형 @default "primary" */
  variant?: "primary" | "danger";
}
```

### AuthCardHeader Props

```typescript
interface AuthCardHeaderProps {
  /** SVG path 또는 커스텀 아이콘 ReactNode */
  icon?: ReactNode;
  /** 아이콘 영역 SVG path (간편 사용) */
  iconPath?: string;
  /** 아이콘 그라데이션 색상 @default "from-primary to-secondary" */
  iconGradient?: string;
  /** 제목 */
  title: string;
  /** 제목 색상 클래스 */
  titleClassName?: string;
  /** 부제목 */
  subtitle?: string;
  /** 로고 URI (아이콘 대신 이미지 사용) */
  logoUri?: string;
  /** 로고/아이콘의 alt 텍스트 */
  logoAlt?: string;
}
```

## 변형 (Variants)

| variant | 좌측 오브 색상 |
|---------|---------------|
| primary | bg-primary/30 |
| danger | bg-danger/20 |

## HeroUI 매핑

순수 구현. observer로 감싸져 있음.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | `widget` 디렉터리 이동에 맞춰 위치/타입 문구 정리 | codex |
