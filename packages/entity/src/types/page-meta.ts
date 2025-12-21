/**
 * 페이지 메타 정보 인터페이스
 * 페이지네이션 응답에서 사용됩니다.
 */
export interface IPageMeta {
  readonly skip: number;
  readonly take: number;
  readonly totalCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}
