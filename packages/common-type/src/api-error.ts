/**
 * 서버가 데이터베이스 오류를 안전한 형태로 전달할 때 사용하는 계약입니다.
 * SQL 원문이나 Prisma의 전체 meta는 이 타입에 포함하지 않습니다.
 */
export interface ApiDatabaseError {
	code: string;
	target?: string;
	retryable: boolean;
}
