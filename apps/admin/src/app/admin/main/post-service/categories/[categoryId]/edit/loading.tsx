type LoadingProps = {
  children: React.ReactNode;
};

export default function Loading(props: LoadingProps) {
  return <div className="loading">{props.children}</div>;
}
