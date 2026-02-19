# GroupInfoSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/group/GroupInfoSection/

## 역할

그룹 상세 화면에서 기본 정보(이름, 라벨, 유형, 생성일, 수정일)를 2열 그리드로 표시하는 섹션입니다.

## Props

```typescript
interface GroupInfoSectionProps {
  group: GroupInfo;
}

interface GroupInfo {
  name: string;
  label?: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| (없음 - 순수 HTML 그리드) | dt/dd 정의 목록으로 표시 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
