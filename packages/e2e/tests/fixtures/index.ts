import { test as base } from "@playwright/test";

/**
 * 커스텀 테스트 픽스처
 * 공통으로 사용되는 설정이나 헬퍼를 정의합니다
 */
export const test = base.extend<{
  // 여기에 커스텀 픽스처 타입 정의
}>({
  // 여기에 커스텀 픽스처 구현
});

export { expect } from "@playwright/test";
