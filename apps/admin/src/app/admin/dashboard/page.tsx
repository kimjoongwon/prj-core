'use client';

import { AutoComplete, Editor } from '@coc/ui';
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
  }));

  console.log(state.htmlText);
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
      <div className='w-[300px]'>
        <Editor state={state} path="htmlText" />
      </div>
      <div>{state.htmlText}</div>
    </div>
  );
}

export default observer(DashboardPage);
