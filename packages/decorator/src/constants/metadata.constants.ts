/**
 * @ApiResponseEntity 데코레이터에서 사용하는 메타데이터 키
 * DtoTransformInterceptor가 이 메타데이터를 읽어 자동으로 Entity → DTO 변환을 수행합니다.
 */

/**
 * Controller 메서드가 반환하는 DTO 클래스 정보
 * @example SetMetadata(DTO_CLASS_METADATA, UserDto)
 */
export const DTO_CLASS_METADATA = "api:response:dto_class";

/**
 * 반환 데이터가 배열인지 여부
 * @example SetMetadata(DTO_IS_ARRAY_METADATA, true)
 */
export const DTO_IS_ARRAY_METADATA = "api:response:is_array";

/**
 * DtoTransformInterceptor를 특정 엔드포인트에서 스킵
 * @example @SetMetadata(SKIP_DTO_TRANSFORM, true)
 */
export const SKIP_DTO_TRANSFORM = "dto:skip_transform";
