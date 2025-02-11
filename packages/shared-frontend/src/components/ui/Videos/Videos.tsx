import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import { Video } from 'lucide-react';

async function getVideos() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadsDir, { recursive: true });

    const files = await readdir(uploadsDir);
    return files.filter(file => file.match(/\.(mp4|webm|ogg)$/i));
  } catch (error) {
    console.error('업로드 디렉토리 접근 오류:', error);
    return [];
  }
}

export default async function Videos() {
  const videos = await getVideos();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <div
              key={video}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
            >
              <video controls className="w-full h-40 object-cover">
                <source
                  src={`/uploads/${video}`}
                  type={`video/${video.split('.').pop()}`}
                />
                Your browser does not support the video tag.
              </video>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                  {video}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
