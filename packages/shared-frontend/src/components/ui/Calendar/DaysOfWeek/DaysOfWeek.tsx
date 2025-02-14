import { Button } from '../../Button/Button';

export const DaysOfWeek = () => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <div className="grid grid-cols-7">
      {daysOfWeek.map(dayOfWeek => {
        return (
          <Button
            disabled={true}
            variant="light"
            key={dayOfWeek}
            color={['토', '일'].includes(dayOfWeek) ? 'danger' : 'default'}
          >
            {dayOfWeek}
          </Button>
        );
      })}
    </div>
  );
};
