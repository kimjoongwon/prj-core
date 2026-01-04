/**
 * LoggerUtil - 프로젝트 전반에서 사용할 통합 로거 유틸리티
 *
 * @description
 * 일관된 로그 형식과 이모지를 사용하여 디버깅과 모니터링을 용이하게 합니다.
 * 각 모듈별로 고유한 prefix를 가질 수 있으며, 다양한 로그 레벨을 지원합니다.
 *
 * @example
 * ```typescript
 * import { LoggerUtil } from '@cocrepo/toolkit';
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
	[key: string]: unknown;
}

export interface Logger {
	info(message: string, data?: LogData | string | number | boolean): void;
	success(message: string, data?: LogData | string | number | boolean): void;
	warning(message: string, data?: LogData | string | number | boolean): void;
	error(message: string, data?: LogData | string | number | boolean): void;
	debug(message: string, data?: LogData | string | number | boolean): void;
}

/**
 * 새로운 로거 인스턴스를 생성합니다.
 *
 * @param prefix - 로그 메시지 앞에 표시될 접두사 (예: '[useButtonLogic]')
 * @returns Logger 인스턴스
 */
export function createLogger(prefix: string): Logger {
	return {
		/**
		 * 정보성 로그를 출력합니다.
		 */
		info(message: string, data?: LogData | string | number | boolean): void {
			console.log(`🔍 ${prefix} ${message}`, data || "");
		},

		/**
		 * 성공 로그를 출력합니다.
		 */
		success(message: string, data?: LogData | string | number | boolean): void {
			console.log(`✅ ${prefix} ${message}`, data || "");
		},

		/**
		 * 경고 로그를 출력합니다.
		 */
		warning(message: string, data?: LogData | string | number | boolean): void {
			console.warn(`⚠️ ${prefix} ${message}`, data || "");
		},

		/**
		 * 에러 로그를 출력합니다.
		 */
		error(message: string, data?: LogData | string | number | boolean): void {
			console.error(`❌ ${prefix} ${message}`, data || "");
		},

		/**
		 * 디버그 로그를 출력합니다.
		 */
		debug(message: string, data?: LogData | string | number | boolean): void {
			console.debug(`🐛 ${prefix} ${message}`, data || "");
		},
	};
}
