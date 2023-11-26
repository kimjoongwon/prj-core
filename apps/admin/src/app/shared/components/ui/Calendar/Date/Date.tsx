interface DateProps {
  date: Date;
}

export const Date = (props: DateProps) => {
  const { date } = props;
  return <div>Date</div>;
};
