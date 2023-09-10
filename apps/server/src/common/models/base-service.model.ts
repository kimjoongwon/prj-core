import { Injectable } from '@nestjs/common';
import { Delegate } from './delegate.model';
import { CrudTypeMap } from './crud-type-map.model';

@Injectable()
export abstract class BaseService<D extends Delegate, T extends CrudTypeMap> {
  constructor(protected delegate: D) {}

  public getDelegate(): D {
    return this.delegate;
  }

  public async _aggregate(data: T['aggregate']) {
    const result = await this.delegate.aggregate(data);
    return result;
  }

  public async _count(data?: T['count']) {
    const result = await this.delegate.count(data);
    return result;
  }

  public async _create(data: T['create']) {
    const result = await this.delegate.create(data);
    return result;
  }

  public async _findMany(data?: T['findMany']) {
    const result = await this.delegate.findMany(data);
    return result;
  }
}
