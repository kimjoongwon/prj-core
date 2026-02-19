# AuthCard UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/AuthCard/

## 역할

인증 페이지(로그인, 회원가입 등)용 카드 래퍼. 배경 블러 오브 + 중앙 정렬 카드 + 푸터를 포함한다.

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
