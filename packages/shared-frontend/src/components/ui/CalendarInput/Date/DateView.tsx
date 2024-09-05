import { observer } from 'mobx-react-lite';
import { Card, CardBody, CardHeader } from '../../NextUI';
import { DateModel } from '../_types';
import { Text } from '../../Text';

interface DateViewProps {
  state: DateModel;
}

export const DateView = observer((props: DateViewProps) => {
  const { state } = props;
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
        <Text>{state.value.getDate()}일</Text>
      </CardBody>
    </Card>
  );
});
