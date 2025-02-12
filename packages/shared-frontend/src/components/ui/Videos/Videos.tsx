'use client';
import { Video } from 'lucide-react';

async function getVideos() {
  try {
    // public/uploads 디렉토리의 파일 목록을 가져오는 것은 서버 사이드에서만 가능합니다.
    // 클라이언트 사이드에서는 직접 접근할 수 없습니다.
    // 여기서는 빈 배열을 반환하거나, API를 통해 서버에서 파일 목록을 가져오는 것을 고려해야 합니다.
    console.warn(
      '클라이언트 사이드에서는 파일 시스템에 직접 접근할 수 없습니다.',
    );
    return [];
  } catch (error) {
    console.error('파일 목록을 가져오는 중 오류 발생:', error);
    return [];
  }
}

export default function Videos() {
  const videos = [];
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        업로드된 비디오
      </h2>
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <Video className="w-16 h-16 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            아직 업로드된 비디오가 없습니다.
          </p>
        </div>
      ) : (
        <ul>
          {videos.map(video => (
            <li key={video} className="mb-2">
              <video
                src={`/uploads/${video}`}
                controls
                className="w-full rounded-md shadow-md"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
