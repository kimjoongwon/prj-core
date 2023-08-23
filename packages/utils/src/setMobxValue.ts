// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setMobxValue(obj: any, path: any, val: any) {
  const keys = path?.split('.');
  if (keys.length === 0) {
    throw new Error('path is empty');
  }

  const lastKey = keys.pop();
  const lastObj = keys.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj: any, key: any) => (obj[key] = obj?.[key] || {}),
    obj,
  );
  lastObj[lastKey] = val;
}
