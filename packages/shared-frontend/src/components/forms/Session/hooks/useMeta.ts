import { RepeatCycleTypes, SessionTypes } from '../../../../model';

export const useMeta = () => {
  const sessionTypeOptions = [
    {
      text: '일회성',
      value: SessionTypes.ONE_TIME,
    },
    {
      text: '반복',
      value: SessionTypes.RECURRING,
    },
  ];

  const repeatCycleTypeOptions: {
    text: string;
    value: RepeatCycleTypes;
  }[] = [
    {
      text: '매일',
      value: RepeatCycleTypes.DAY,
    },
    {
      text: '매주',
      value: RepeatCycleTypes.WEEK,
    },
    {
      text: '매월',
      value: RepeatCycleTypes.MONTH,
    },
    {
      text: '매년',
      value: RepeatCycleTypes.YEAR,
    },
  ];

  return {
    sessionTypeOptions,
    repeatCycleTypeOptions,
  };
};
