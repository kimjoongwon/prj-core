import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

export const useAuth = () => {
  return useContext(AuthContext);
};
