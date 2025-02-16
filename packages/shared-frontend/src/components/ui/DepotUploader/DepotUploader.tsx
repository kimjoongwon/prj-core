import { observer, useLocalObservable } from 'mobx-react-lite';
import { FileUploader, FileUploaderProps } from '../FileUploader/FileUploader';
import { get, set } from 'lodash-es';
import { createDepot, getDepotById } from '../../../apis';
import { useEffect } from 'react';
import { DepotService } from '../../../store';
import { reaction, toJS } from 'mobx';
import { MobxProps } from '@shared/types';

interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value'> {}

export const DepotUploader = observer(
  <T extends object>(props: DepotProps<T>) => {
    const { state, path, ...rest } = props;

    const localState = useLocalObservable(() => {
      return {
        depotId: get(state, path) as string,
        value: [],
      };
    });

    useEffect(() => {
      const disposer = reaction(
        () => localState.depotId,
        () => {
          set(state, path, localState.depotId);
        },
      );
      return disposer;
    }, []);

    useEffect(() => {
      const setInitialValue = async () => {
        if (localState.depotId) {
          const { data: depot } = await getDepotById(localState.depotId);
          if (depot?.files) {
            const files = await Promise.all(
              depot.files?.map(async file => {
                return DepotService.urlToFile(
                  file.url,
                  file.name,
                  file.mimeType,
                );
              }),
            );

            localState.value = files;
          }
        }
      };

      setInitialValue();
    }, []);

    const handleFilesChange = async (files: File[]) => {
      if (files.length === 0) {
        return null;
      }

      if (props.type === 'image') {
        const images = files.filter(file => file.type.startsWith('image/'));
        if (images.length === 0) {
          return null;
        }

        const response = await createDepot({
          images,
        });

        const depotId = response.data.id;

        localState.depotId = depotId;
      }
    };

    return (
      <FileUploader
        {...rest}
        value={toJS(localState.value)}
        onFilesChange={handleFilesChange}
      />
    );
  },
);
