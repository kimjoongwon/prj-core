export interface IRepository {
  create(args: unknown): unknown;
  upsert(args: unknown): unknown;
  update(args: unknown): unknown;
  updateMany(args: unknown): unknown;
  delete(args: unknown): unknown;
  findMany(args: unknown): unknown;
  findUnique(args: unknown): unknown;
  findFirst(args: unknown): unknown;
  count(args: unknown): unknown;
}
