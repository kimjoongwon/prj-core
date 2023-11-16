import { Base } from '@common';

export const GetOmitFields = <T extends Base>(): readonly (keyof T)[] => {
  return ['id', 'updatedAt', 'createdAt', 'deletedAt'];
};
