import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/base.repository';
import { AbstractEntity } from '../entity';
import { QueryDto } from '../dto';

// Method names that can have include configurations
type BaseServiceMethodNames = 'getManyByQuery' | 'getById' | 'create' | 'updateById';

// Helper type to ensure type safety for include options
export interface BaseServiceOptions<TInclude = any> {
  includeMap?: Partial<Record<BaseServiceMethodNames, TInclude>>;
}

// Helper type to create type-safe service options
export type CreateServiceOptions<TInclude> = BaseServiceOptions<TInclude>;

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
  TInclude = any,
> {
  protected options: BaseServiceOptions<TInclude>;

  constructor(
    protected readonly repository: TRepository,
    options: BaseServiceOptions<TInclude> = {},
  ) {
    this.options = options;
  }

  create(createDto: CreateDto) {
    const args: any = { data: createDto };

    // Apply include if configured for this method
    if (this.options.includeMap?.['create']) {
      args.include = this.options.includeMap['create'];
    }

    return this.repository.create(args) as Promise<R>;
  }

  async getManyByQuery(query: QD): Promise<{ items: R[]; count: number }> {
    const args = query.toArgs() as any;

    // Apply include if configured for this method
    if (this.options.includeMap?.['getManyByQuery']) {
      args.include = this.options.includeMap['getManyByQuery'];
    }

    const countArgs = query.toCountArgs();
    const items = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      items,
      count,
    } as { items: R[]; count: number };
  }

  updateById(id: string, updateDto: UpdateDto) {
    const args: any = {
      where: { id },
      data: updateDto,
    };

    // Apply include if configured for this method
    if (this.options.includeMap?.['updateById']) {
      args.include = this.options.includeMap['updateById'];
    }

    return this.repository.update(args) as Promise<R>;
  }

  getById(id: string) {
    const args: any = { where: { id } };

    // Apply include if configured for this method
    if (this.options.includeMap?.['getById']) {
      args.include = this.options.includeMap['getById'];
    }

    return this.repository.findUnique(args) as Promise<R>;
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
