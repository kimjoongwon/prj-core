import { CreateSessionDto } from '@shared';
import dayjs from 'dayjs';

export const mockSessions: CreateSessionDto[] = [
  {
    tenantId: '56f81110-0dea-49e4-a231-3755901e3acc',
    name: '일회용 세션',
    type: 'ONE_TIME',
    repeatCycle: 0,
    repeatCycleType: 'WEEK',
    recurringDayOfTheWeek: [],
    startDate: dayjs().toDate(),
    endDate: dayjs().toDate(),
    timelineDates: [dayjs().toISOString()],
  },
  {
    tenantId: '56f81110-0dea-49e4-a231-3755901e3acc',
    name: '일회용 범위 세션',
    type: 'ONE_TIME_RANGE',
    repeatCycle: 0,
    repeatCycleType: 'WEEK',
    recurringDayOfTheWeek: [],
    endDate: dayjs().add(1, 'day').toDate(),
    startDate: dayjs().toDate(),
    timelineDates: [dayjs().toISOString(), dayjs().add(1, 'day').toISOString()],
  },
  {
    tenantId: '56f81110-0dea-49e4-a231-3755901e3acc',
    name: '반복 세션 - 매주 월요일',
    type: 'ONE_TIME_RANGE',
    repeatCycle: 3,
    repeatCycleType: 'WEEK',
    recurringDayOfTheWeek: ['MONDAY'],
    endDate: undefined,
    startDate: undefined,
    timelineDates: [dayjs().add(3, 'week').toISOString(), dayjs().add(6, 'week').toISOString()],
  },
  {
    tenantId: '56f81110-0dea-49e4-a231-3755901e3acc',
    name: '세션-1',
    type: 'ONE_TIME',
    repeatCycle: 0,
    repeatCycleType: 'WEEK',
    recurringDayOfTheWeek: [],
    endDate: undefined,
    startDate: undefined,
    timelineDates: [],
  },
];
