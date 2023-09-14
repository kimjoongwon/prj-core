export const queryBuilder = (
  args: Record<any, any>,
  filterKeys: string[] = [],
  // sortKeys: string[] = [],
) => {
  const _args = {};
  Object.entries(args).forEach(([key, value]) => {
    if (['cursor'].includes(key)) {
      if (args[key] === undefined) {
        delete args[key];
      }
      _args['cursor']['id'] = value;
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
  });

  return _args;
};
