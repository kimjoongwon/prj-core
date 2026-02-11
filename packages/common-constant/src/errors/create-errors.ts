import { COMMON_ERRORS } from "./common.errors";

export interface CrudErrors {
  readonly NOT_FOUND: string;
  readonly CREATE_FAILED: string;
  readonly UPDATE_FAILED: string;
  readonly DELETE_FAILED: string;
  readonly INVALID_DATA: string;
}

/**
 * 한글 마지막 글자의 받침(종성) 유무를 판단하여 "을/를" 조사를 반환합니다.
 *
 * - 한글이면 유니코드 종성 계산
 * - 영어/기타는 "을(를)" fallback
 */
function getParticle(displayName: string): string {
  const lastChar = displayName[displayName.length - 1];
  if (!lastChar) return "을(를)";

  const code = lastChar.charCodeAt(0);

  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (code >= 0xac00 && code <= 0xd7a3) {
    const jongseong = (code - 0xac00) % 28;
    return jongseong !== 0 ? "을" : "를";
  }

  // 한글이 아닌 경우 (영어 등)
  return "을(를)";
}

function createCrudErrors(displayName: string): CrudErrors {
  const particle = getParticle(displayName);
  return {
    NOT_FOUND: `${displayName}${particle} 찾을 수 없습니다`,
    CREATE_FAILED: `${displayName} 생성에 실패했습니다`,
    UPDATE_FAILED: `${displayName} 업데이트에 실패했습니다`,
    DELETE_FAILED: `${displayName} 삭제에 실패했습니다`,
    INVALID_DATA: `유효하지 않은 ${displayName} 데이터입니다`,
  };
}

/**
 * COMMON_ERRORS + 표준 CRUD 에러 + 도메인 고유 에러
 * User, Auth, Ability 등 인증 컨텍스트가 필요한 도메인용
 *
 * extra에서 CRUD 키를 지정하면 자동 생성된 메시지를 오버라이드합니다.
 */
export function createEntityErrors<T extends Record<string, string>>(
  displayName: string,
  extra: T,
): typeof COMMON_ERRORS & CrudErrors & Readonly<T> {
  return {
    ...COMMON_ERRORS,
    ...createCrudErrors(displayName),
    ...extra,
  } as typeof COMMON_ERRORS & CrudErrors & Readonly<T>;
}

/**
 * 표준 CRUD 에러 + 도메인 고유 에러 (COMMON 미포함)
 * Action, Translation, Grant 등 독립 도메인용
 *
 * extra에서 CRUD 키를 지정하면 자동 생성된 메시지를 오버라이드합니다.
 */
export function createDomainErrors<T extends Record<string, string>>(
  displayName: string,
  extra: T,
): CrudErrors & Readonly<T> {
  return {
    ...createCrudErrors(displayName),
    ...extra,
  } as CrudErrors & Readonly<T>;
}
