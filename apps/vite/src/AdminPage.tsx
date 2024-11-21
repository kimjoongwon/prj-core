import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin/auth/login');
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
};
