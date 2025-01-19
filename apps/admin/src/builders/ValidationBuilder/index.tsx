// import React, { Children } from 'react';
// import { observer } from 'mobx-react-lite';
// import { isEmpty } from 'remeda';
// import { ValidationBuilder as ValidationBuilderState } from '@shared/types';

// interface FormValidatorProps {
//   children: React.ReactNode;
//   state: ValidationBuilderState;
// }

// export const ValidationBuilder = observer((props: FormValidatorProps) => {
//   const { state, children } = props;

//   const child = Children.only(children);

//   if (child === null) {
//     throw new Error('child is required');
//   }

//   const callbacks =
//     state.timings?.map(timing => {
//       return {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         [timing]: (value: any) => {
//           if (state.required) {
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
