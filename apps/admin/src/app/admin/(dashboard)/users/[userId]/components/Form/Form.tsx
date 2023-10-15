import { Card } from '@coc/ui';
import { observer } from 'mobx-react-lite';
interface FormProps {
  schema: any;
  state: {
    name: string;
    categoryItemId: string;
  };
}
export const Form = observer(() => {
  return <Card>{/* <Input /> */}</Card>;
});
