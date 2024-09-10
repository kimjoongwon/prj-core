export interface IService {
  getUnique(args: unknown): unknown;
  getFirst(args: unknown): unknown;
  create(args: unknown): unknown;
  getManyByQuery(args: unknown): unknown;
  remove(args: unknown): unknown;
  removeMany(args: unknown): unknown;
  delete(args: unknown): unknown;
  update(id: string, args: unknown): unknown;
}
