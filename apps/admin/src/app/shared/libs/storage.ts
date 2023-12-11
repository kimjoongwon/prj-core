interface LocalStorage {
  tenantId: string;
  accessToken: string;
}

export const setItem = <K extends keyof LocalStorage>(
  key: K,
  value: LocalStorage[K],
) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = <K extends keyof LocalStorage>(
  key: K,
): LocalStorage[K] | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
