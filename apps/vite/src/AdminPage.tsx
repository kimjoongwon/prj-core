import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin/auth/login');
  }, []);

  return <></>;
};
