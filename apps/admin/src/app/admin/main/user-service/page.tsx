interface UserServicePageProps {
  children: React.ReactNode;
}

const UserServicePage = (props: UserServicePageProps) => {
  const { children } = props;
  return <div>{children}</div>;
};

export default UserServicePage;
