# Avatar UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Avatar/

## 역할

사용자 아바타와 드롭다운 메뉴를 표시하는 컴포넌트. 데스크톱에서는 사용자 이름/설명과 함께 표시하고, 모바일에서는 아바타 이미지만 표시한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ showInfo=true (데스크톱) ]

┌─────────────────────────────┐
│  ┌──┐  홍길동          ▾   │
│  │AB│  관리자 (admin)       │
│  └──┘                       │
└─────────────────────────────┘
         ↓ 클릭 시 드롭다운
┌─────────────────────────────┐
│  개발 환경  (비활성)         │
├─────────────────────────────┤
│  👤 프로필                   │
│  ⚙  설정                    │
│  ❓ 도움말                   │
├─────────────────────────────┤
│  🚪 로그아웃       (danger)  │
└─────────────────────────────┘


[ showInfo=false (모바일) ]

  ┌──┐
  │AB│  ▾
  └──┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| showInfo=true | 아바타 + 이름 + 설명 + 드롭다운 트리거 |
| showInfo=false | 아바타 이미지만 표시 (아이콘 버튼) |

## Props

```typescript
interface AvatarProps {
  /** 사용자 정보(이름, 설명) 표시 여부 @default true */
  showInfo?: boolean;
  /** 메뉴 액션 핸들러 (profile, settings, help, logout 등) */
  onMenuAction?: (key: string) => void;
}
```

## 상태

| 상태 | 스타일 |
|------|--------|
| showInfo=true | User 컴포넌트 + 이름/설명 표시 |
| showInfo=false | Avatar 이미지만 표시 (아이콘 버튼) |

## 변형 (Variants)

| 변형 | 설명 |
|------|------|
| showInfo=true | 데스크톱용 - 사용자 이름/설명 포함 |
| showInfo=false | 모바일용 - 아바타만 표시 |

## 드롭다운 메뉴 항목

| 키 | 라벨 | 설명 |
|----|------|------|
| environment | 환경 정보 | 현재 환경 표시 (비활성) |
| profile | 프로필 | 계정 정보 관리 |
| settings | 설정 | 앱 설정 및 환경설정 |
| help | 도움말 | 사용 가이드 및 문의 |
| logout | 로그아웃 | 계정에서 로그아웃 (danger) |

## HeroUI 매핑

기반: `import { Avatar as HeroUIAvatar, User, Button, Chip } from '@heroui/react'`

내부 Dropdown: `import { Dropdown } from '../../../inputs/Dropdown/Dropdown'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
