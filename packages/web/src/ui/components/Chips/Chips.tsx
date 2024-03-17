import { ChipProps } from '@nextui-org/react';
import { Chip } from '../Chip/Chip';
import { observer } from 'mobx-react-lite';

interface ChipsProps {
  data: ChipProps[];
}
export const Chips = observer((props: ChipsProps) => {
  const { data } = props;

  return (
    <div className="space-x-2">
      {data.map(item => (
        <Chip variant="flat" color='primary' {...item}>
          {item.title}
        </Chip>
      ))}
    </div>
  );
});
