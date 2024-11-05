import React from 'react';

interface GroupsPageLayoutProps {
  children: React.ReactNode;
}

const GroupsPageLayout = async (props: GroupsPageLayoutProps) => {
  const { children } = props;

  return <>{children}</>;
};

export default GroupsPageLayout;
