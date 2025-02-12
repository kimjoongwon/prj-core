'use client';

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
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
import { observer } from 'mobx-react-lite';

interface SortableFileProps {
  file: File;
  onRemove: (name: string) => void;
}

function SortableFile({ file, onRemove }: SortableFileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
    width: '100px',
    height: '100px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative touch-none"
      {...attributes}
      {...listeners}
    >
      {file.type.startsWith('image/') ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <span className="text-gray-500">{file.name}</span>
        </div>
      )}
      <button
        onClick={() => onRemove(file.name)}
        className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}

export interface FileUploaderProps {
  label?: string;
  mode: 'single' | 'multiple';
  maxFiles?: number;
  uploadType: 'image' | 'file' | 'both';
  onFilesChange?: (files: File[]) => void;
  value: File[];
}

export const FileUploader = observer(
  ({
    mode,
    maxFiles = 9,
    uploadType = 'image',
    onFilesChange,
    label,
    value,
  }: FileUploaderProps) => {
    const [files, setFiles] = useState<File[]>(value);

    useEffect(() => {
      if (onFilesChange) {
        onFilesChange(files);
      }
    }, [files]);

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
          const oldIndex = items.findIndex(item => item.name === active.id);
          const newIndex = items.findIndex(item => item.name === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);

        if (mode === 'single') {
          setFiles([newFiles[0]]);
        } else {
          setFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, maxFiles));
        }
      }
    };

    const removeFile = (name: string) => {
      setFiles(files.filter(file => file.name !== name));
    };

    return (
      <Card className="p-6" style={{ width: '400px' }}>
        <div className="space-y-6">
          <h1 className="text-xl font-semibold text-center">{label || ''}</h1>

          <div className="space-y-4">
            {mode === 'multiple' && (
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
                items={files.map(file => file.name)}
                strategy={rectSortingStrategy}
              >
                <div
                  className={
                    mode === 'single'
                      ? 'flex justify-center items-center'
                      : 'grid grid-cols-3 gap-2'
                  }
                >
                  {files.map(file => (
                    <SortableFile
                      key={file.name}
                      file={file}
                      onRemove={removeFile}
                    />
                  ))}
                  {(mode === 'multiple'
                    ? files.length < maxFiles
                    : files.length === 0) && (
                    <label
                      className={`${
                        mode === 'single' ? 'w-full max-w-[200px]' : ''
                      } aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                      style={{ width: '100px', height: '100px' }}
                    >
                      <input
                        type="file"
                        accept={
                          uploadType === 'image'
                            ? 'image/*'
                            : uploadType === 'file'
                            ? '*/*'
                            : 'image/*, */*'
                        }
                        multiple={mode === 'multiple'}
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {mode === 'single' ? '파일 업로드' : '파일 추가'}
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
