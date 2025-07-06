export class DateTimeUtils {
  static getFormattedDate(date: Date): string {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  static toTodayISO() {
    return new Date().toISOString();
  }
}
