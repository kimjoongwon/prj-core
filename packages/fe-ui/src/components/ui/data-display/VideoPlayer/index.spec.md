# VideoPlayer UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/VideoPlayer/

## 역할

모달에서 비디오를 재생하는 컴포넌트. 재생/일시정지, 전체화면 전환 기능을 제공한다.

## Props

```typescript
interface VideoPlayerProps {
  /** 비디오 소스 URL */
  src: string;
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}
```

## 상태

| 상태 | 동작 |
|------|------|
| isPlaying=true | 재생 중, Pause 아이콘 표시 |
| isPlaying=false | 일시정지, Play 아이콘 표시 |
| isFullscreen=true | 전체화면 모드, Minimize 아이콘 |
| isFullscreen=false | 일반 모드, Maximize 아이콘 |
| isOpen=false | 비디오 정지 및 시작점으로 리셋 |

## 내부 의존성

- `lucide-react` (Play, Pause, Maximize, Minimize)

## HeroUI 매핑

기반: `import { Modal, ModalContent } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
