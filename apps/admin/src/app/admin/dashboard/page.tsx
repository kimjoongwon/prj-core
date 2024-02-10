'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { Input, Button, Textarea } from '@coc/shared';
import { modalStore } from '@stores';
import { action } from 'mobx';

function DashboardPage() {
  const state = useLocalObservable(() => ({
    space: 'aaaa',
    htmlText: '',
    textArea: '',
    tests: ['test', 'test2'],
  }));

  console.log(modalStore.SelectModal.isOpen);

  return (
    <div className="w-full">
      <Input state={state} path="space" />
      <Text king={state} />
      <Textarea />
      <Button
        onClick={action(() => {
          modalStore.SelectModal.isOpen = true;
        })}
      >
        모달 오픈
      </Button>
    </div>
  );
}

const Text = observer((props: { king: any }) => {
  const { king } = props;
  return <p className="whitespace-pre">{king?.textArea}</p>;
});

export default observer(DashboardPage);
