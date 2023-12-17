'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { Input, Button } from '@coc/ui';

function DashboardPage() {
  const state = useLocalObservable(() => ({
    space: 'aaaa',
    htmlText: '',
    textArea: '',
    tests: ['test', 'test2'],
  }));

  return (
    <div className="w-full">
      <Input state={state} path="space" />
      <Text king={state} />
      <Button />
    </div>
  );
}

const Text = observer((props: { king: any }) => {
  const { king } = props;
  return <p className="whitespace-pre">{king?.textArea}</p>;
});

export default observer(DashboardPage);
