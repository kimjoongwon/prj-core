import { useContext } from 'react';
import { AccountContext } from '../../providers/AccountProvider';

export const useAccount = () => {
  return useContext(AccountContext);
};
