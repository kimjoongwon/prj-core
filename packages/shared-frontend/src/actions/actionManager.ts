export function getActionManager() {
  return {
    getPath: (params: any, queryKeyFn: any) => {
      const searchParams = new URLSearchParams(params).toString();
      const [queryKey] = queryKeyFn(params);
      const path = queryKey + '?' + searchParams;
      return path;
    },
  };
}
