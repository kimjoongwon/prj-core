import { observer } from 'mobx-react-lite';
import type { FileUploaderProps } from '../FileUploader';
import { VideoUploader } from '../VideoUploader';
import type { MobxProps } from '@shared/types';

interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value'> {}

export const VideoDepot = observer(<T extends object>(props: DepotProps<T>) => {
  return <VideoUploader {...props} />;
});
