export class Response<T> {
  constructor(data) {
    this.data = data;
  }
  data: T;
}

export class PaginatedResponse<T> extends Response<T> {
  totalCount: number;
}
