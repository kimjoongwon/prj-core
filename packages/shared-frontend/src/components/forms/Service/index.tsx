import { CreateServiceDto } from '../../../model/createServiceDto';
import { UpdateServiceDto } from '../../../model/updateServiceDto';
import { Input, VStack } from '../../ui';

interface ServiceFormProps {
  state: CreateServiceDto | UpdateServiceDto;
}

export const ServiceForm = (props: ServiceFormProps) => {
  const { state } = props;
  return (
    <VStack>
      <Input
        label="카테고리명"
        state={state}
        path="name"
        placeholder="카테고리명을 입력해주세요."
      />
      <Input
        label="라벨"
        state={state}
        path="label"
        placeholder="카테고리 라벨을 입력해주세요."
      />
    </VStack>
  );
};
