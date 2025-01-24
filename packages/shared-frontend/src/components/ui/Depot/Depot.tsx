import { FileUploader } from '../FileUploader/FileUploader';

interface State {
  depotId: string;
}

interface DepotProps {
  state: State;
}

export const Depot = (props: DepotProps) => {
  const { state } = props;

  const handleFilesChange = (files: File[]) => {
    // s3에 업로드 이후 받은 depotId를 state에 저장
    console.log(files);
  };

  return (
    <FileUploader
      mode={'multiple'}
      uploadType={'image'}
      onFilesChange={handleFilesChange}
    />
  );
};
