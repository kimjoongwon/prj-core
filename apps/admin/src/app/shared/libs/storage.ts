interface LocalStorage {
  tenantId: string;
}

const setItem = <K extends keyof LocalStorage>(
  key: K,
  value: LocalStorage[K],
) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = <K extends keyof LocalStorage>(
  key: K,
): LocalStorage[K] | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (error) {
    return item;
  }
};

export const storage = {
  setItem,
  getItem,
};
