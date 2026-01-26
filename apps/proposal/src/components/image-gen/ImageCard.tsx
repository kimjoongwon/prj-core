"use client";

import { Button, Image } from "@heroui/react";
import { Copy, Download, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

interface ImageCardProps {
  src: string;
  filename: string;
  onDownload?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const ImageCard = observer(({
  src,
  filename,
  onDownload,
  onCopy,
  onDelete,
  showActions = true,
}: ImageCardProps) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-content2 border border-divider">
      <div className="aspect-square">
        <Image
          src={src}
          alt={filename}
          className="w-full h-full object-cover"
          removeWrapper
        />
      </div>

      {showActions && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onDownload && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={onDownload}
              aria-label="다운로드"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          {onCopy && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={onCopy}
              aria-label="클립보드에 복사"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color="danger"
              onPress={onDelete}
              aria-label="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
