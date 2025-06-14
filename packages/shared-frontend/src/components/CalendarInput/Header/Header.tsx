import { Button } from '../../Button';
import { HStack } from '../../HStack';
import { useProps } from '../_hooks/useProps';
import { observer } from 'mobx-react-lite';

interface HeaderProps {
  state: ReturnType<typeof useProps>['state'];
}

export const Header = observer((props: HeaderProps) => {
  const { state } = props;

  return (
    <div className="flex justify-between">
      <HStack className="justify-between items-center">
        <Button
          size="sm"
          variant="light"
          // @ts-ignore
          onPress={state.calendarInput.header.decreaseMonth}
          startContent={<div>prev</div>}
        />
        <div className="flex space-x-2">
          <Year state={state} />
          <Month state={state} />
        </div>
        <Button
          size="sm"
          variant="light"
          // @ts-ignore
          onPress={state.calendarInput.header.increaseMonth}
          endContent={<div>next</div>}
        />
      </HStack>
    </div>
  );
});

interface YearProps {
  state: ReturnType<typeof useProps>['state'];
}

export const Year = observer((props: YearProps) => {
  const { state } = props;
  return (
    <div className="text-2xl lg:text-4xl font-bold">
      {
        // @ts-ignore
        state.calendarInput.header.date?.getFullYear()
      }
      년
    </div>
  );
});

export const Month = observer((props: YearProps) => {
  const { state } = props;
  return (
    <div className="text-2xl lg:text-4xl font-bold">
      {
        // @ts-ignore
        state.calendarInput.header.date?.getMonth() + 1
      }
      월
    </div>
  );
});
