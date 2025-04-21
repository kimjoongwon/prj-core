import { plainToInstance } from 'class-transformer';
import { AbstractDto } from '../dtos/abstract.dto';
import { Constructor } from '../decorators/use-dto.decorator';

export class AbstractEntity<DTO extends AbstractDto, O = never> {
  id: string;
  seq: number;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;

  private dtoClass?: Constructor<any, any>;

  toDto?(options?: O): DTO {
    return plainToInstance(this.dtoClass, this, options);
  }
}
