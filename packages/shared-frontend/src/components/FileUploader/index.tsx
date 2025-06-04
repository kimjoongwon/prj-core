'use client';

import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { SortableMedia } from './SortableMedia';
import { v4 } from 'uuid';
import { FileDto } from '@shared/api-client';

export interface FileUploaderProps {
  label?: string;
  selectionMode: 'single' | 'multiple';
  maxFiles?: number;
  type: 'image' | 'video' | 'all';
  onFilesChange?: (
    type: FileUploaderProps['type'],
    fileDtos: Partial<FileDto>[],
  ) => void;
  onFileRemove?: (fileDto: Partial<FileDto>) => void;
  value: Partial<FileDto>[];
}

export const FileUploader = observer(
  ({
    selectionMode,
    maxFiles = 9,
    type = 'image',
    onFilesChange,
    onFileRemove,
    label,
    value,
  }: FileUploaderProps) => {
    const [files, setFiles] = useState<FileUploaderProps['value']>([]);

    useEffect(() => {
      setFiles(value || []);
    }, [value]);

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
        setFiles(items => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);
        const fileDtos: Partial<FileDto>[] = newFiles.map((file, index) => ({
          id: v4(),
          name: file.name,
          url: URL.createObjectURL(file),
          mimeType: file.type,
        }));

        if (selectionMode === 'single') {
          setFiles([fileDtos[0]]);
          onFilesChange(type, fileDtos);
        } else {
          setFiles(prevFiles => [...prevFiles, ...fileDtos].slice(0, maxFiles));
          onFilesChange(type, fileDtos);
        }
      }
      e.target.value = '';
    };

    const removeFile = (id: string) => {
      const fileToRemove = files.find(file => file.id === id);
      if (fileToRemove) {
        setFiles(files.filter(file => file.id !== id));
        if (onFileRemove) {
          onFileRemove(fileToRemove);
        }
      }
    };

    return (
      <Card className="p-4 m-1 w-full">
        <div className="space-y-6">
          <h1 className="text-xl font-semibold text-center">{label || ''}</h1>

          <div className="space-y-4">
            {selectionMode === 'multiple' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-600 text-sm">
                  파일은 최대 {maxFiles}개까지 업로드할 수 있습니다
                </p>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={files?.map(file => file.id)}
                strategy={rectSortingStrategy}
              >
                <div
                  className={
                    selectionMode === 'single'
                      ? 'flex justify-center items-center'
                      : 'grid grid-cols-3 gap-2 justify-center items-center'
                  }
                >
                  {files?.map(file => (
                    <SortableMedia
                      key={file.id}
                      media={file}
                      onRemove={removeFile}
                    />
                  ))}
                  {(selectionMode === 'multiple'
                    ? files.length < maxFiles
                    : files.length === 0) && (
                    <label
                      className={`${
                        selectionMode === 'single' ? 'w-full max-w-[200px]' : ''
                      } aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                      style={{ width: '110px', height: '110px' }}
                    >
                      <input
                        type="file"
                        accept={
                          type === 'image'
                            ? 'image/*'
                            : type === 'video'
                            ? 'video/*'
                            : 'image/*, video/*'
                        }
                        multiple={selectionMode === 'multiple'}
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Upload className="h-8 w-8 text-gray-400 m-2" />
                      <span className="text-sm text-gray-500">
                        {selectionMode === 'single'
                          ? '파일 업로드'
                          : '파일 추가'}
                      </span>
                    </label>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </Card>
    );
  },
);
