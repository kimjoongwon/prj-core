import React from 'react';

interface UserServiceLayoutProps {
  children: React.ReactNode;
}

export type UserServicePageParams = {
  serviceId: string;
};

const UserServiceLayout = (props: UserServiceLayoutProps) => {
  const { children } = props;
  return <>{children}</>;
};

export default UserServiceLayout;
