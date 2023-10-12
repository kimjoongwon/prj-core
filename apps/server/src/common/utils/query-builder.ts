import { set } from 'lodash';

export const queryBuilder = (
  args: Record<any, any>,
  filterKeys: string[] = [],
): any => {
  const _args = {
    orderBy: {
      id: 'desc',
    },
  };
  Object.entries(args).forEach(([key, value]) => {
    if (['cursor'].includes(key)) {
      if (args[key] === undefined) {
        delete args[key];
      }
      Object.assign(_args, {
        cursor: {
          id: value,
        },
      });
    }

    if (filterKeys.includes(key)) {
      Object.assign(_args, {
        where: {
          ..._args?.['where'],
          [key]: {
            contains: args[key],
          },
        },
      });
    }

    if (['take', 'skip'].includes(key)) {
      _args[key] = value;
    }

    if (['sortingKey', 'sortingValue'].includes(key)) {
      Object.assign(_args, {
        orderBy: { ...set({}, args.sortingKey, args.sortingValue) },
      });
    }
  });
  console.log('_args', _args);
  return _args;
};
