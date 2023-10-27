import { CreateServiceInput, UpdateServiceInput } from '@__generated__/graphql';

interface ServiceFormProps {
  state: CreateServiceInput | UpdateServiceInput;
}
export function ServiceForm(props: ServiceFormProps) {
  return (
    <>
      <div>ServiceForm</div>
    </>
  );
}
