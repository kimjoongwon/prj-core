'use client';

import { observer } from 'mobx-react-lite';
import { useProps } from './hooks/useProps';
import { SessionFormView, SessionFormViewProps } from './SessionFormView';

interface SessionFormProps extends SessionFormViewProps {}

export const SessionForm = observer((props: SessionFormProps) => {
  const _props = useProps();
  return <SessionFormView {...props} {..._props} />;
});
