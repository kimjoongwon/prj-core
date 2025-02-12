import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { Input } from '../Input/Input';
import { Editor } from '../Editor';
import { ImageDepot } from '../ImageDepot/ImageDepot';
import { observer } from 'mobx-react-lite';

export enum TextTypes {
  MARKDOWN = 'MARKDOWN',
  HTML = 'HTML',
  NORMAL = 'NORMAL',
}

interface State {
  title: string;
  description: string;
  type: TextTypes;
  depotId: string;
  text: string;
}

interface ContentProps {
  state: State;
}

export const Content = observer((props: ContentProps) => {
  const {
    state = {
      title: '',
      description: '',
      type: '',
      depotId: '',
    },
  } = props;

  const textTypeOptions = [
    { text: '마크다운', value: TextTypes.MARKDOWN },
    { text: 'HTML', value: TextTypes.HTML },
    { text: '일반', value: TextTypes.NORMAL },
  ];

  return (
    <Card>
      <CardHeader>
        <Input
          label="제목"
          placeholder="제목을 입력하세요."
          state={state}
          path="title"
        />
      </CardHeader>
      <CardBody>
        <Input
          state={state}
          path="description"
          label="설명"
          placeholder="설명을 입력하세요."
        />
        {state.type === TextTypes.NORMAL && (
          <Input
            label="내용"
            placeholder="내용을 입력하세요."
            state={state}
            path="text"
          />
        )}
        {state.type === TextTypes.HTML && <Editor state={state} path="text" />}
      </CardBody>
      <CardFooter>
        <ImageDepot state={state} path="depotId" mode="single" uploadType="image" />
      </CardFooter>
    </Card>
  );
});
