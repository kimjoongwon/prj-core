import { observer, useLocalObservable } from 'mobx-react-lite';
import { FileUploader, FileUploaderProps } from '../FileUploader/FileUploader';
import { get, set } from 'lodash-es';
import { getDepotById } from '../../../apis';
import { useEffect } from 'react';
import { DepotService } from '../../../store';
import { reaction, toJS } from 'mobx';
import { MobxProps } from '@shared/types';

interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value'> {}

export const Depot = observer(<T extends object>(props: DepotProps<T>) => {
  const { state, path, ...rest } = props;

  const localState = useLocalObservable<{ value: File[] }>(() => {
    return {
      value: [],
    };
  });

  useEffect(() => {
    const disposer = reaction(
      () => localState.value,
      () => {
        set(state, path, localState.value);
      },
    );

    return disposer;
  }, []);

  useEffect(() => {
    const setInitialValue = async () => {
      const depotId = get(state, path) as unknown as string;
      if (depotId) {
        console.log('depotId', depotId);
        const { data: depot } = await getDepotById(depotId);
        if (depot?.files) {
          const files = await Promise.all(
            depot.files?.map(async file => {
              return DepotService.urlToFile(file.url, file.name, file.mimeType);
            }),
          );

          localState.value = files;
        }
      }
    };

    setInitialValue();
  }, []);

  const handleFilesChange = (files: File[]) => {
    if (files.length === 0) {
      return null;
    }
    localState.value = files;
  };

  return (
    <FileUploader
      {...rest}
      value={toJS(localState.value)}
      onFilesChange={handleFilesChange}
    />
  );
});
