import { Video } from 'lucide-react';

export function Videos() {
  const videos = [];
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">
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
          {videos?.map(video => (
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
