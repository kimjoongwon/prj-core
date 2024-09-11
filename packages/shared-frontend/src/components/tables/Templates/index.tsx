'use client';

import { observer } from 'mobx-react-lite';
import { useProps } from './hooks/useProps';
import { TemplatesTableView } from './TemplatesTableView';
import { TemplateDto } from '../../../model';

export interface TemplatesTableProps {
  templates: TemplateDto[];
}

export const TemplatesTable = observer((props: TemplatesTableProps) => {
  const { templates } = props;
  const { columns, leftButtons, state, rightButtons } = useProps();

  return (
    <TemplatesTableView
      templates={templates}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
});
