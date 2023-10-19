export * from './modal';
export interface RawItems<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}
