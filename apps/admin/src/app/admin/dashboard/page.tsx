'use client';

import { AutoComplete, Editor, Textarea } from '@coc/ui';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { observer, useLocalObservable } from 'mobx-react-lite';

function DashboardPage() {
  const state = useLocalObservable(() => ({
    space: 'aaaa',
    htmlText: '',
    textArea: '',
  }));

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button>test</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="test1">test</DropdownItem>
          <DropdownItem key="test2">test</DropdownItem>
          <DropdownItem key="test3">test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <AutoComplete
        state={state}
        path="space"
        label="사용자 소속"
        options={[
          {
            text: 'test',
            value: 'test',
          },
          {
            text: 'aaaa',
            value: 'aaaa',
          },
          {
            text: 'bbb',
            value: 'bbb',
          },
        ]}
      />
      <Textarea state={state} path="textArea" />
      <div className="w-[300px]">
        <Editor state={state} path="htmlText" />
      </div>
      <Text king={state} />
    </div>
  );
}

const Text = observer((props: { king: any }) => {
  const { king } = props;
  console.log(king.textArea);
  return <p className="whitespace-pre">{king?.textArea}</p>;
});

export default observer(DashboardPage);
