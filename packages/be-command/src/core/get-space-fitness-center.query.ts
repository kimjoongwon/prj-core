/**
 * 특정 스페이스의 피트니스 센터 정보를 조회하기 위한 쿼리 메시지입니다.
 */
export class GetSpaceFitnessCenterQuery {
	constructor(readonly spaceId: bigint) {}
}
