// import { useLocalObservable } from 'mobx-react-lite';
// import { FileUploader } from '../FileUploader/FileUploader';
// import { get } from 'lodash-es';

// interface State {
//   depotId: string;
// }

// interface DepotProps {
//   state: State;
//   path: string;
// }

// export const Depot = (props: DepotProps) => {
//   const { state, path } = props;

//   const urlToFile = async (
//     url: string,
//     filename: string,
//     mimeType: string,
//   ): Promise<File> => {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return new File([blob], filename, { type: mimeType });
//   };

//   // const localState = useLocalObservable(async () => {
//   //   const files = await Promise.all(
//   //     get(state, path)?.map(async (url: string) => {
//   //       // const depot = await getDepot(id);
//   //       return urlToFile(depot.url, depot.filename, depot.mimeType);
//   //     }),
//   //   );
//   //   return {
//   //     value: get(state, path),
//   //   };
//   // });

//   // const handleFilesChange = (files: File[]) => {
//   //   localState.value = files;
//   // };

//   return (
//     <FileUploader
//       mode="multiple"
//       uploadType="image"
//       onFilesChange={handleFilesChange}
//     />
//   );
// };
