import { observer, useLocalObservable } from 'mobx-react-lite';
import { FileUploader, FileUploaderProps } from '../FileUploader/FileUploader';
import { get, set } from 'lodash-es';
import {
  createDepot,
  getDepotById,
  removeFileById,
  updateDepotById,
} from '../../../apis';
import { useEffect } from 'react';
import { reaction, toJS } from 'mobx';
import { MobxProps } from '@shared/specs';
import { DepotDto, FileDto } from '../../../model';
import { DepotService } from '../../../services/depot';

interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value'> {}

export const DepotUploader = observer(
  <T extends object>(props: DepotProps<T>) => {
    const { state, path, ...rest } = props;

    const localState: {
      depotId: string;
      depot: DepotDto;
    } = useLocalObservable(() => {
      return {
        depotId: get(state, path) as string,
        depot: {} as DepotDto,
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
          localState.depot = depot;
        }
      };

      setInitialValue();
    }, []);

    const handleFilesChange: FileUploaderProps['onFilesChange'] = async (
      type,
      fileDtos,
    ) => {
      if (fileDtos?.length === 0) {
        return null;
      }
      // depot이 있느냐 없느냐
      if (localState.depotId) {
        const files = await Promise.all(
          fileDtos.map(async fileDto => {
            const file = await DepotService.urlToFile(
              fileDto.url,
              fileDto.name,
              fileDto.mimeType,
            );
            return file;
          }),
        );

        await updateDepotById(localState.depotId, {
          videos: files,
        });

        const res = await getDepotById(localState.depotId);
        localState.depotId = res.data?.id;
      } else {
        const files = await Promise.all(
          fileDtos.map(async fileDto => {
            const file = await DepotService.urlToFile(
              fileDto.url,
              fileDto.name,
              fileDto.mimeType,
            );
            return file;
          }),
        );

        const res = await createDepot({
          files,
        });

        localState.depotId = res.data?.id;
      }
    };

    return (
      <FileUploader
        {...rest}
        value={toJS(localState.depot.files)}
        onFilesChange={handleFilesChange}
        onFileRemove={async (fileDto: FileDto) => {
          await removeFileById(fileDto.id);
        }}
      />
    );
  },
);
