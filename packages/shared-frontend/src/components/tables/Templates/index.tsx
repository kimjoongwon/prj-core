'use client';

import { observer } from 'mobx-react-lite';
import { useProps } from './hooks/useProps';
import { TemplatesTableView } from './TemplatesTableView';
import { TemplateDto } from '../../../model';
import { TableProps } from '@nextui-org/react';

export interface TemplatesTableProps extends TableProps {
  templates: TemplateDto[];
}

export const TemplatesTable = observer((props: TemplatesTableProps) => {
  const { templates, ...rest } = props;
  const { columns, leftButtons, state, rightButtons } = useProps();

  return (
    <TemplatesTableView
      {...rest}
      templates={templates}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
});
