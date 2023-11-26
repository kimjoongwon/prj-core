export const DaysOfWeek = () => {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

  return (
    <>
      {daysOfWeek.map(dayOfWeek => {
        return (
          <div
            className={
              ['SAT', 'SUN'].includes(dayOfWeek) ? 'text-danger-400' : undefined
            }
          >
            {dayOfWeek}
          </div>
        );
      })}
    </>
  );
};
