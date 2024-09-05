'use client';

import { observer } from 'mobx-react-lite';
import { SessionFormView } from './SessionFormView';
import { SessionFormProps } from './types';

export const SessionForm = observer((props: SessionFormProps) => {
  return <SessionFormView {...props} />;
});
