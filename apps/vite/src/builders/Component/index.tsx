import { observer } from 'mobx-react-lite';
import { ComponentBuilder as ComponentBuilderState } from '@shared/types';
import { ComponentManager, DataGrid } from '@shared/frontend';
import { isEmpty } from 'lodash-es';
import { useFormState } from '../FormBuilder';
import { toJS } from 'mobx';
import { HeaderBuilder } from '../HeaderBuilder';
import { CellBuilder } from '../CellBuilder';
import { ColumnDef } from '@tanstack/react-table';

interface ComponentBuilderProps {
  componentBuilder: ComponentBuilderState;
  data?: (unknown & { id: string })[];
}

export const Component = observer((props: ComponentBuilderProps) => {
  const formState = useFormState();
  const { componentBuilder, data = [] } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[componentBuilder.type];
  const callbacks = componentBuilder.validation?.timings?.map(timing => {
    return {
      [timing]: (value: unknown) => {
        if (!componentBuilder.validation) {
          return null;
        }
        if (componentBuilder.validation?.required) {
          if (isEmpty(value)) {
            componentBuilder.validation.errorMessage = componentBuilder
              .validation?.messages?.required as string;
            componentBuilder.validation.isInvalid = true;
            return;
          }
        }
        componentBuilder.validation.errorMessage = '';
        componentBuilder.validation.isInvalid = false;
      },
    };
  });

  const _props = callbacks?.reduce((acc, callback) => {
    return { ...acc, ...callback };
  });

  if (componentBuilder.type === 'DataGrid') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const columns = componentBuilder?.props?.columns?.map(column => {
      return {
        id: column.id,
        accessorKey: column.accessorKey,
        header: props => {
          return <HeaderBuilder {...props} {...column.header} />;
        },
        cell: props => <CellBuilder {...props} {...column.cell} />,
      } as ColumnDef<unknown & { id: string }, unknown>;
    });
    return <DataGrid data={data || []} columns={toJS(columns) || []} />;
  }
  return (
    <Component
      {...componentBuilder.props}
      state={formState?.payload}
      path={componentBuilder.path}
      componentBuilder={componentBuilder}
      errorMessage={componentBuilder.validation?.errorMessage || ' '}
      isInvalid={componentBuilder.validation?.isInvalid}
      {..._props}
    />
  );
});
