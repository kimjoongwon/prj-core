import React, { Children, ReactElement } from 'react';

interface ValidationControlProps {
  children: ReactElement;
  timings: string[];
  validator: any;
}

export const ValidationControl = (props: ValidationControlProps) => {
  const { children, timings, validator } = props;

  const child = Children.only(children);

  console.log('?');
  const callbacks = timings.map(timing => {
    console.log(child);
    if (child.props && typeof child.props[timing] === 'function') {
      console.log('child.props', child.props);
      return {
        callback: (...args: any[]) => {
          console.log('안녕!');
          child.props[timing](...args);
        },
      };
    }
  });

  console.log(callbacks);
  return React.cloneElement(child, {
    ...callbacks,
  });
};

// export function DebounceClick({ capture = 'onClick', options, children, wait }: Props) {
//   const child = Children.only(children);
//   const debouncedCallback = useDebounce(
//     (...args: any[]) => {
//       if (child.props && typeof child.props[capture] === 'function') {
//         return child.props[capture](...args);
//       }
//     },
//     wait,
//     options
//   );

//   return cloneElement(child, {
//     [capture]: debouncedCallback,
//   });
// }
