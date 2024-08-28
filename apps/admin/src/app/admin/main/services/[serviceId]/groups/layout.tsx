interface GroupsPageLayoutProps {
  children: React.ReactNode;
}

const GroupsPageLayout = async (props: GroupsPageLayoutProps) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default GroupsPageLayout;
