/**
 * LoggerUtil - 프로젝트 전반에서 사용할 통합 로거 유틸리티
 *
 * @description
 * 일관된 로그 형식과 이모지를 사용하여 디버깅과 모니터링을 용이하게 합니다.
 * 각 모듈별로 고유한 prefix를 가질 수 있으며, 다양한 로그 레벨을 지원합니다.
 *
 * @example
 * ```typescript
 * import { LoggerUtil } from '@shared/utils';
 *
 * // 기본 사용법
 * const logger = LoggerUtil.create('[MyComponent]');
 * logger.info('컴포넌트 초기화', { props });
 * logger.error('API 호출 실패', error);
 *
 * // 임시 로거 (prefix 없이)
 * LoggerUtil.info('간단한 로그');
 * ```
 */

export interface LogData {
  [key: string]: any;
}

export class LoggerUtil {
  private prefix: string;

  constructor(prefix: string = "") {
    this.prefix = prefix;
  }

  /**
   * 새로운 로거 인스턴스를 생성합니다.
   *
   * @param prefix - 로그 메시지 앞에 표시될 접두사 (예: '[useButtonLogic]')
   * @returns LoggerUtil 인스턴스
   */
  static create(prefix: string): LoggerUtil {
    return new LoggerUtil(prefix);
  }

  /**
   * 정보성 로그를 출력합니다.
   *
   * @param message - 로그 메시지
   * @param data - 추가 데이터 (선택사항)
   */
  info(message: string, data?: LogData | string | number | boolean): void {
    console.log(`🔍 ${this.prefix} ${message}`, data || "");
  }

  /**
   * 성공 로그를 출력합니다.
   *
   * @param message - 로그 메시지
   * @param data - 추가 데이터 (선택사항)
   */
  success(message: string, data?: LogData | string | number | boolean): void {
    console.log(`✅ ${this.prefix} ${message}`, data || "");
  }

  /**
   * 경고 로그를 출력합니다.
   *
   * @param message - 로그 메시지
   * @param data - 추가 데이터 (선택사항)
   */
  warning(message: string, data?: LogData | string | number | boolean): void {
    console.warn(`⚠️ ${this.prefix} ${message}`, data || "");
  }

  /**
   * 에러 로그를 출력합니다.
   *
   * @param message - 로그 메시지
   * @param data - 추가 데이터 (선택사항)
   */
  error(message: string, data?: LogData | string | number | boolean): void {
    console.error(`❌ ${this.prefix} ${message}`, data || "");
  }

  /**
   * 디버그 로그를 출력합니다.
   *
   * @param message - 로그 메시지
   * @param data - 추가 데이터 (선택사항)
   */
  debug(message: string, data?: LogData | string | number | boolean): void {
    console.debug(`🐛 ${this.prefix} ${message}`, data || "");
  }

  // 정적 메서드들 - prefix 없이 바로 사용 가능
  /**
   * 정보성 로그를 출력합니다 (정적 메서드).
   */
  static info(message: string, data?: LogData | string | number | boolean): void {
    console.log(`🔍 ${message}`, data || "");
  }

  /**
   * 성공 로그를 출력합니다 (정적 메서드).
   */
  static success(message: string, data?: LogData | string | number | boolean): void {
    console.log(`✅ ${message}`, data || "");
  }

  /**
   * 경고 로그를 출력합니다 (정적 메서드).
   */
  static warning(message: string, data?: LogData | string | number | boolean): void {
    console.warn(`⚠️ ${message}`, data || "");
  }

  /**
   * 에러 로그를 출력합니다 (정적 메서드).
   */
  static error(message: string, data?: LogData | string | number | boolean): void {
    console.error(`❌ ${message}`, data || "");
  }

  /**
   * 디버그 로그를 출력합니다 (정적 메서드).
   */
  static debug(message: string, data?: LogData | string | number | boolean): void {
    console.debug(`🐛 ${message}`, data || "");
  }
}
