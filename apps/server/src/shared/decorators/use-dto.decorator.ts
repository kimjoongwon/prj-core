/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export function UseDto(dtoClass: Constructor): ClassDecorator {
  return (ctor) => {
    // FIXME make dtoClass function returning dto

    if (!(<unknown>dtoClass)) {
      throw new Error('UseDto decorator requires dtoClass');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ctor.prototype.dtoClass = dtoClass;
  };
}
export function UseEntity(entityClass: Constructor): ClassDecorator {
  return (ctor) => {
    // FIXME make dtoClass function returning dto

    if (!(<unknown>entityClass)) {
      throw new Error('UseEntity decorator requires entityClass');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ctor.prototype.dtoClass = entityClass;
  };
}
