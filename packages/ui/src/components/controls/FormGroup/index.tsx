import React from 'react';

interface FormGroupControlProps {
  direction?: 'row' | 'col';
  children: React.ReactNode;
}

export function FormGroupControl(props: FormGroupControlProps) {
  const { children, direction = 'row' } = props;

  return (
    <div className={`flex flex-1 flex-${direction} gap-3`}>{children}</div>
  );
}
