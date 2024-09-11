import { TemplateDto } from '../../../model';
import { DataGrid } from '../../ui/DataGrid';
import { useProps } from './hooks/useProps';

interface TemplatesTableViewProps extends ReturnType<typeof useProps> {
  templates: TemplateDto[];
}

export const TemplatesTableView = (props: TemplatesTableViewProps) => {
  const { templates, columns, state, rightButtons, leftButtons } = props;

  return (
    <DataGrid
      selectionMode="multiple"
      data={templates}
      columns={columns}
      state={state}
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  );
};
