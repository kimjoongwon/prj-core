import { observer } from 'mobx-react-lite';
import { DateModel } from '@shared/types';
import { Text } from '../../../ui/Text';
import dayjs from 'dayjs';
import { Card, CardBody } from '@heroui/react';

interface DateViewProps {
  state: DateModel;
}

export const DateView = observer((props: DateViewProps) => {
  const { state } = props;
  const date = dayjs(state.value).get('date');
  return (
    <Card
      isPressable={state.isPressable}
      shadow="sm"
      radius="sm"
      isHoverable
      onClick={() => state.selectDate()}
      className={
        state.className +
        `${state.selected ? ' bg-primary-500 text-white' : ''} h-20`
      }
    >
      <CardBody className="text-right">
        <Text>{date}일</Text>
      </CardBody>
    </Card>
  );
});
