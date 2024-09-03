import { describe, expect, test } from 'vitest';
import dayjs from 'dayjs';
import { renderHook, act } from '@testing-library/react';
import { autorun } from 'mobx';
import { useProps } from './_hooks/useProps';

describe('CalendarInput', () => {
  test('onClickNextMonth', () => {
    const { result: propsResult } = renderHook(() => useProps({}));

    const nextMonth = dayjs().add(1, 'M').startOf('D').toDate().getMonth();

    let observedMonth;

    const dispose = autorun(() => {
      observedMonth = propsResult.current.state.calendarDate.getMonth();
    });

    act(() => {
      propsResult.current.onClickNextMonth();
    });

    console.log('Observed Month:', observedMonth);
    console.log('Expected Next Month:', nextMonth);

    expect(observedMonth).toBe(nextMonth);

    dispose(); // autorun을 정리합니다.
  });
});
