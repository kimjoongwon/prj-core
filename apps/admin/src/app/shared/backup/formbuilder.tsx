// export const FormBuilder = observer((props: any) => {
//   const formDataElements = props?.formData?.elements;
//   const formData = props?.formData;
//   const formList = {
//     hStack(props: any) {
//       return <HStack>{renderChildrens(props)}</HStack>;
//     },
//     vStack(props: any) {
//       return <VStack>{renderChildrens(props)}</VStack>;
//     },
//     input(props: any) {
//       return (
//         <FormControl>
//           <Input className="flex-1" />
//         </FormControl>
//       );
//     },
//     select: (props: any) => {
//       return (
//         <FormControl>
//           <Select {...props} />
//         </FormControl>
//       );
//     },
//     textArea: () => {
//       return (
//         <FormControl>
//           <Textarea />
//         </FormControl>
//       );
//     },
//   };

//   const renderChildrens = (element: any) => {
//     if (element.key === 'vStack' || element.key === 'hStack') {
//       return element.elements.map((element: any) => {
//         // @ts-ignore
//         return formList?.[element.key]({ ...element });
//       });
//     }

//     // @ts-ignore
//     return formList[element.key]({ ...element });
//   };
//   // @ts-ignore
//   return formData?.elements?.map(element => {
//     // @ts-ignore
//     return formList?.[element.key]({ ...element });
//   });
// });
