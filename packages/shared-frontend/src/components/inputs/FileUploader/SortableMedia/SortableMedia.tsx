import { X, Play } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type SortableMediaProps } from '@shared/types';
import { VideoPlayer } from '../VideoPlayer';
import { action, observable } from 'mobx';
import { v4 } from 'uuid';

export const state = observable({
  open: false,
});

export function SortableMedia({ media, onRemove }: SortableMediaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const url = media.url;
  console.log('media', media);
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="relative aspect-square touch-none"
        {...attributes}
        {...listeners}
      >
        {media.mimeType.includes('image') ? (
          <img
            src={url || '/placeholder.svg'}
            alt="Uploaded content"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="relative w-full h-full cursor-pointer">
            <video
              src={url}
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
              onClick={action(() => (state.open = true))}
            >
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
        )}
        <button
          onClick={() => {
            onRemove(media.id);
          }}
          className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
      <VideoPlayer src={url} />
    </>
  );
}
