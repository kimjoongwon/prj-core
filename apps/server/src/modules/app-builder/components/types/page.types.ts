export type PageType = 'create' | 'modify' | 'detail' | 'add';

export interface ResourceConfig {
  name: string;
  label: string;
  invalidationKey: string;
}

export interface PageBuilderOptions<T = any> {
  id: string;
  type: PageType;
  defaultData: T;
  resourceConfig?: ResourceConfig;
}
