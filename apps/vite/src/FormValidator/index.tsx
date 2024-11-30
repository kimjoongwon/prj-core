// import React, { Children, ReactElement } from 'react';
// import { observer } from 'mobx-react-lite';
// import { isEmpty } from 'remeda';
// import { BValidation, PageState } from '@shared/types';

// interface FormValidatorProps {
//   children: ReactElement;
//   state: PageState;
//   validation: BValidation;
//   componentNo: number;
//   formIndex: number;
// }

// export const FormValidator = observer((props: FormValidatorProps) => {
//   const { children, validation, state, componentNo, formIndex } = props;

//   const child = Children.only(children);

//   if (child === null) {
//     throw new Error('child is required');
//   }

//   const callbacks =
//     validation.timings?.map(timing => {
//       return {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         [timing]: (value: any) => {
//           if (validation.required) {
//             if (isEmpty(value)) {
//               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//               // @ts-expect-error
//               state.forms[formIndex].components[
//                 componentNo
//               ].validation.errorMessage = validation.messages?.[
//                 'required'
//               ] as string;
//               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//               // @ts-expect-error
//               state.forms[formIndex].components[
//                 componentNo
//               ].validation.isInValid = true;
//               return;
//             }
//           }
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           // @ts-expect-error
//           state.forms[formIndex].components[
//             componentNo
//           ].validation.errorMessage = '';
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           // @ts-expect-error
//           state.forms[formIndex].components[componentNo].validation.isInValid =
//             false;
//         },
//       };
//     }) || [];

//   const childProps = Object.assign(
//     {
//       isInvalid:
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         state.forms[formIndex].components[componentNo].validation.isInValid,
//       errorMessage:
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         state.forms[formIndex].components[componentNo].validation.errorMessage,
//     },
//     ...callbacks,
//   );
//   return <>{React.cloneElement(child, childProps)}</>;
// });
