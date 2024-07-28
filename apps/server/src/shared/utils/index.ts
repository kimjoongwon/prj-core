export class PaginationMananger {
  static getPage = ({ skip, take }: { skip: number; take: number }): number => {
    if (take === 0) {
      throw new Error('Take must be greater than 0');
    }
    const page = Math.floor(skip / take) + 1;
    return page;
  };

  static toArgs = <T>(query: T) => {
    return Object.entries(query)
      .map(([key, value]) => {
        let object;
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
}
