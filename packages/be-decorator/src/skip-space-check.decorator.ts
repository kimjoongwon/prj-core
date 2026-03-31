import { SetMetadata } from "@nestjs/common";

export const SKIP_SPACE_CHECK_KEY = "skipSpaceCheck";

/**
 * selectedSpaceId 쿠키 검증을 건너뛰는 데코레이터
 * @description 인증은 필요하지만 Space 선택이 불필요한 엔드포인트에 사용
 * (예: 사용자의 Space 목록 조회)
 */
export const SkipSpaceCheck = () => SetMetadata(SKIP_SPACE_CHECK_KEY, true);
