import { FileDto } from '../../../model';

export interface UploadedMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface SortableMediaProps {
  media: Partial<FileDto>;
  onRemove: (id: string) => void;
}

export interface MediaUploadProps {
  mode: 'single' | 'multiple';
  maxFiles?: number;
}

export interface VideoPlayerProps {
  src: string;
}
