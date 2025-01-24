import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { Input } from '../Input';
import { Select } from '../Select/Select';
import { FileUploader } from '../FileUploader/FileUploader';
import { Depot } from '../Depot/Depot';

interface State {
  title: string;
  description: string;
  type: string;
  depotId: string;
}

interface ContentProps {
  state: State;
}

export const Content = (props: ContentProps) => {
  const {
    state = {
      title: '',
      description: '',
      type: '',
      depotId: '',
    },
  } = props;

  return (
    <Card>
      <CardHeader>
        <Input state={state} path="title" />
      </CardHeader>
      <CardBody>
        <Select state={state} path="type" />
        <Input state={state} path="description" />
      </CardBody>
      <CardFooter>
        <Depot state={state} />
      </CardFooter>
    </Card>
  );
};
