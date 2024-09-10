'use client';

import { observer } from 'mobx-react-lite';
import { SessionFormView } from './SessionFormView';
import { SessionFormProps } from './types';
import { useProps } from './hooks/useProps';

export const SessionForm = observer((props: SessionFormProps) => {
  const _props = useProps(props);

  return <SessionFormView {..._props} />;
});
