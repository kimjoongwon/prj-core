import { observer } from 'mobx-react-lite';
import { CreateServiceDto } from '../../../model/createServiceDto';
import { UpdateServiceDto } from '../../../model/updateServiceDto';
import { Input, VStack } from '../../ui';

interface ServiceFormProps {
  state: CreateServiceDto | UpdateServiceDto;
}

export const ServiceForm = observer((props: ServiceFormProps) => {
  const { state } = props;
  return (
    <VStack className="gap-2">
      <Input
        label="서비스명"
        state={state}
        path="name"
        placeholder="서비스명을 입력해주세요."
      />
      <Input
        label="라벨"
        state={state}
        path="label"
        placeholder="서비스 라벨을 입력해주세요."
      />
    </VStack>
  );
});
