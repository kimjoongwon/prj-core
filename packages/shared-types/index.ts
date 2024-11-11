export interface Validation {
  timing: 'onBlur' | 'onChange' | 'onClick';
  required: boolean;
  message: string;
}

export interface Element {
  type: 'Input';
  path: string;
  label: string;
  placeholder: string;
  validation?: Validation;
}
export interface Layout {
  type: 'Auth' | 'Empty' | 'Main';
}

export interface Form {
  name: string;
  elements: Element[];
  submitButton: SubmitButton;
}

export interface SubmitButton {
  title: string;
  mutationKey: string;
  onSuccess: OnSuccess;
}

interface OnSuccess {
  navigate: {
    pathname: string;
  };
}

export interface IPage {
  name: string;
  pathname: string;
  form?: Form;
  state: object;
  layout: Layout;
}
