import { QueryDto } from "./query.dto";

/**
 * API 목록 조회 DTO의 공통 베이스입니다.
 */
export class PrismaQueryDto<
	TWhere extends Record<string, unknown> = Record<string, unknown>,
> extends QueryDto {}
