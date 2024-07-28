import { NumberFieldOptional } from '../../../decorators';

export class PageOptionsDto {
  constructor(partial: Partial<PageOptionsDto>) {
    Object.assign(this, partial);
  }
  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly skip: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;
}

export const toPrismaArgs = (query: any) => {
  return Object.entries(query)
    .map(([key, value]) => {
      let object: any = {
        take: 10,
        page: 0,
        where: {},
        orderBy: {},
      };
      if (key === 'take' || key === 'skip') {
        object = {
          [key]: value,
        };
        return object;
      }

      if (key.endsWith('SortOrder') && value) {
        object = {
          orderBy: {
            [key.replace('SortOrder', '')]: value,
          },
        };

        return object;
      }

      object = {
        where: {
          [key]: value,
        },
      };

      return object;
    })
    .reduce((acc, curr) => {
      return {
        ...acc,
        ...curr,
        where: {
          ...acc.where,
          ...curr.where,
        },
        orderBy: {
          ...acc.orderBy,
          ...curr.orderBy,
        },
      };
    });
};
