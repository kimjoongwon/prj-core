import { Base } from '../interfaces';

export const GetBaseFields = <T extends Base>(): readonly (keyof T)[] => {
  return ['id', 'updatedAt', 'createdAt', 'deletedAt'];
};
