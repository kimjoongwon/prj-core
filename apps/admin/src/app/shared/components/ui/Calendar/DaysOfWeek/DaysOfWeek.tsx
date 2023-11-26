export const DaysOfWeek = () => {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

  return (
    <>
      {daysOfWeek.map(dayOfWeek => {
        return <div>{dayOfWeek}</div>;
      })}
    </>
  );
};
