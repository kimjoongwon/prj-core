import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/base.repository';
import { AbstractEntity } from '../entity';
import { QueryDto } from '../dto';

@Injectable()
export class BaseService<
  CreateDto,
  UpdateDto,
  QD extends QueryDto,
  R extends AbstractEntity<any, unknown>,
  TRepository extends BaseRepository<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
> {
  constructor(protected readonly repository: TRepository) {}

  create(createDto: CreateDto) {
    return this.repository.create({
      data: createDto,
    }) as Promise<R>;
  }

  async getManyByQuery(query: QD) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const items = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      items,
      count,
    } as { items: R[]; count: number };
  }

  updateById(id: string, updateDto: UpdateDto) {
    return this.repository.update({
      where: { id },
      data: updateDto,
    }) as Promise<R>;
  }

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    }) as Promise<R>;
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    }) as Promise<R>;
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    }) as Promise<R>;
  }
}
