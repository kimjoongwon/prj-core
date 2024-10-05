import { Chip } from '../../Chip';

export const DaysOfWeek = () => {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];

  return (
    <>
      {daysOfWeek.map(dayOfWeek => {
        return (
          <Chip
            variant="light"
            color={['SAT', 'SUN'].includes(dayOfWeek) ? 'danger' : 'default'}
            className="place-self-center"
          >
            {dayOfWeek}
          </Chip>
        );
      })}
    </>
  );
};
