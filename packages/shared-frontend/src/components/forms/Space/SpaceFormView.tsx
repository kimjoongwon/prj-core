import { observer } from 'mobx-react-lite';
import { VStack } from '../../ui/VStack';
import { Input } from '../../ui/Input';
import { CreateSpaceDto, UpdateSpaceDto } from '../../../model';

interface SpaceViewProps {
  state: CreateSpaceDto | UpdateSpaceDto;
}

export const SpaceFormView = observer((props: SpaceViewProps) => {
  const { state } = props;
  return (
    <VStack>
      <Input state={state} path="name" />
    </VStack>
  );
});
