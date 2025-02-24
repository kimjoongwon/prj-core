import { observer, useLocalObservable } from 'mobx-react-lite';
import { FileUploader, FileUploaderProps } from '../FileUploader/FileUploader';
import { get, set } from 'lodash-es';
import {
  createDepot,
  getDepotById,
  removeFileById,
  updateDepotById,
  updateFileById,
} from '../../../apis';
import { useEffect } from 'react';
import { DepotService } from '../../../store';
import { reaction, toJS } from 'mobx';
import { MobxProps } from '@shared/types';
import { FileDto } from '../../../model';

interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value' | 'type'> {}

enum CategoryNames {
  THUMBNAIL_IMAGE = 'THUMBNAIL_IMAGE',
  THUMBNAIL_VIDEO = 'THUMBNAIL_VIDEO',
  VIDEO_CONTENT = 'VIDEO_CONTENT',
  AUDIO_CONTENT = 'AUDIO_CONTENT',
  DOCUMENT_CONTENT = 'DOCUMENT_CONTENT',
  IMAGE_CONTENT = 'IMAGE_CONTENT',
}

export const DepotUploader = observer(
  <T extends object>(props: DepotProps<T>) => {
    const { state, path, ...rest } = props;

    const localState: {
      depotId: string;
      images: FileDto[];
      videos: FileDto[];
    } = useLocalObservable(() => {
      return {
        depotId: get(state, path) as string,
        images: [],
        videos: [],
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
          console.log('depot', toJS(depot));
          if (depot?.files) {
            localState.images = depot.files.filter(
              file => file.classification?.category.name === '이미지',
            );

            localState.videos = depot.files.filter(
              file => file.classification?.category.name === '영상',
            );
          }
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

        if (type === 'image') {
          await updateDepotById(localState.depotId, {
            images: files,
          });
        }

        if (type === 'video') {
          await updateDepotById(localState.depotId, {
            videos: files,
          });
        }

        const res = await getDepotById(localState.depotId);
        localState.depotId = res.data.id;
      } else {
        let images = [];
        let videos = [];

        if (type === 'image') {
          images = await Promise.all(
            fileDtos.map(fileDto =>
              DepotService.urlToFile(
                fileDto.url,
                fileDto.name,
                fileDto.mimeType,
              ),
            ),
          );
        }

        if (type === 'video') {
          videos = await Promise.all(
            fileDtos.map(fileDto =>
              DepotService.urlToFile(
                fileDto.url,
                fileDto.name,
                fileDto.mimeType,
              ),
            ),
          );
        }

        const res = await createDepot({
          images,
          videos,
        });

        localState.depotId = res.data.id;
      }
    };

    return (
      <div className="flex space-x-2">
        <FileUploader
          {...rest}
          type="image"
          label="이미지"
          value={toJS(localState.images)}
          onFilesChange={handleFilesChange}
          onFileRemove={async (fileDto: FileDto) => {
            await removeFileById(fileDto.id);
            console.log('removed fileDto', fileDto);
          }}
        />
        <FileUploader
          {...rest}
          type="video"
          label="동영상"
          value={toJS(localState.videos)}
          onFilesChange={handleFilesChange}
          onFileRemove={async (fileDto: FileDto) => {
            await removeFileById(fileDto.id);
            console.log('removed fileDto', fileDto);
          }}
        />
      </div>
    );
  },
);
