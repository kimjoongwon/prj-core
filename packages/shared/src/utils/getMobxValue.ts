export function getMobxValue(state: any, path: string) {
  if (
    state === undefined ||
    state === null ||
    path === undefined ||
    path === null
  ) {
    throw new Error('state or path is undefined');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path?.split('.')?.reduce((pre: any, cur: string) => {
    return pre?.[cur];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, state) as any;
}
