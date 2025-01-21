'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@heroui/react';
import { Button } from '../Button';

interface UploadedImage {
  id: string;
  url: string;
}

interface SortableImageProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
}

function SortableImage({ image, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-square touch-none"
      {...attributes}
      {...listeners}
    >
      <img
        src={image.url || '/placeholder.svg'}
        alt="Uploaded content"
        className="w-full h-full object-cover rounded-lg"
      />
      <button
        onClick={() => onRemove(image.id)}
        className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}

export function FileUpload() {
  const [images, setImages] = useState<UploadedImage[]>([
    {
      id: '1',
      url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1996-ziOXB96TaQ5YOU7twYMtmrbnUKkbOj.png',
    },
    { id: '2', url: '/placeholder.svg?height=200&width=200' },
    { id: '3', url: '/placeholder.svg?height=200&width=200' },
    { id: '4', url: '/placeholder.svg?height=200&width=200' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && images.length < 9) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(),
        url: URL.createObjectURL(file),
      }));
      setImages([...images, ...newImages].slice(0, 9));
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <button className="p-2" onClick={() => window.history.back()}>
            <X className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold flex-1 text-center mr-8">
            내 프로필 정보
          </h1>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-600 text-sm">
              프로필 이미지는 최대 9개까지 업로드할 수 있습니다
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 gap-2">
                {images.map(image => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onRemove={removeImage}
                  />
                ))}
                {images.length < 9 && (
                  <label className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <span className="text-3xl text-gray-400">+</span>
                  </label>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button color="primary" className="w-full" size="lg">
            저장
          </Button>
          <Button variant="bordered" className="w-full" size="lg">
            취소
          </Button>
        </div>
      </div>
    </Card>
  );
}
