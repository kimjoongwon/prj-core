import { reaction } from 'mobx';
import { useEffect } from 'react';
import { CreateSessionDto, UpdateSessionDto } from '../../../../model';
import dayjs from 'dayjs';

export const useReactions = ({
  state,
}: {
  state: CreateSessionDto | UpdateSessionDto;
}) => {
  useEffect(() => {
    const disposer = reaction(
      () => state.type,
      () => {
        const isExist = state.timelineDates.some(date =>
          dayjs(date).isSame(state.oneTimeDate, 'day'),
        );
        if (isExist) {
          state.timelineDates = state.timelineDates.filter(
            date => !dayjs(date).isSame(state.oneTimeDate, 'day'),
          );
        } else {
          state.timelineDates.push(state.oneTimeDate);
          state.timelineDates = state.timelineDates.sort((a, b) =>
            dayjs(a).isBefore(b) ? -1 : 1,
          );
        }
      },
    );
    return disposer;
  }, []);
};
