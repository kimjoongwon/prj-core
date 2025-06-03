import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';

export const notification = observable({
  open: false,
  message: '',
  severity: 'success',
});

export const NotificationBuilder = observer(() => {
  return <div>haha?</div>;
});
