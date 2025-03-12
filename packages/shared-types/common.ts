export interface Route {
  name: string;
  pathname: string;
  active?: boolean;
  params: any;
  icon?: string;
  visible?: boolean;
  onClick?: () => void;
  children?: Route[];
}

export type CommonEntities =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'removedAt'
  | 'seq';

export type State<T> = {
  form: {
    inputs: T;
  };
};

export type PageTypeParams = {
  type: 'add' | 'edit' | 'read';
};
