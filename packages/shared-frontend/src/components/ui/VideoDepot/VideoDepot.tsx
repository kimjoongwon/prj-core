import { observer } from 'mobx-react-lite';
import { FileUploaderProps } from '../FileUploader/FileUploader';
import { VideoUploader } from '../VideoUploader/VideoUploader';
import { MobxProps } from '@shared/specs';

interface DepotProps<T>
  extends MobxProps<T>,
    Omit<FileUploaderProps, 'onFilesChange' | 'value'> {}

export const VideoDepot = observer(<T extends object>(props: DepotProps<T>) => {
  return <VideoUploader {...props} />;
});
