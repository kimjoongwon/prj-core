import { observer } from 'mobx-react-lite';
import Videos from '../Videos/Videos';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface VideoUploaderProps {
  label?: string;
}

export const VideoUploader = observer((props: VideoUploaderProps) => {
  const { label } = props;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      if (videoRef.current) {
        videoRef.current.src = URL.createObjectURL(selectedFile);
      }
    } else {
      alert('유효한 비디오 파일을 선택해주세요.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // const formData = new FormData();
    // formData.append('file', file);

    // try {
    //   const result = await createFile();
    //   if (result.success) {
    //     setUploadProgress(100);
    //     setTimeout(() => {
    //       alert('비디오가 성공적으로 업로드되었습니다!');
    //       setFile(null);
    //       setUploadProgress(0);
    //       if (videoRef.current) {
    //         videoRef.current.src = '';
    //       }
    //       if (fileInputRef.current) {
    //         fileInputRef.current.value = '';
    //       }
    //     }, 1000);
    //   } else {
    //     throw new Error(result.error || '업로드 실패');
    //   }
    // } catch (error) {
    //   console.error('업로드 실패:', error);
    //   alert('업로드에 실패했습니다. 다시 시도해주세요.');
    // } finally {
    //   setUploading(false);
    // }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        {label}
      </h1>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">클릭하여 업로드</span> 또는
                  드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP4, WebM, OGG (최대 100MB)
                </p>
              </div>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
          </div>
          {file && (
            <div className="mb-4">
              <video ref={videoRef} controls className="w-full rounded-lg">
                Your browser does not support the video tag.
              </video>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {file.name}
              </p>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
              !file || uploading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            }`}
          >
            {uploading ? '업로드 중...' : '비디오 업로드'}
          </button>
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {uploadProgress}% 완료
              </p>
            </div>
          )}
        </div>
        <Videos />
      </div>
    </div>
  );
});
