import dayjs from 'dayjs';

export class DateTimeUtil {
  static getNow(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }
}
