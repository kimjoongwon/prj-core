import { targetConstructorToSchema } from 'class-validator-jsonschema';
import { InputBuilder } from '@shared/types';
import { Test } from './builder.spec';
export function builder(fn: any = Test) {
  const schema = targetConstructorToSchema(fn);
  let inputs = [];

  Object.entries(schema.properties).forEach(([key, value]) => {
    // const value = value.type;
    const elementTypes = {
      string: 'Input',
      number: 'Input',
      boolean: 'Swicth',
    };
    let inputBuilder: InputBuilder = {
      path: key,
      // @ts-ignore
      type: elementTypes[value.type],
    };

    inputs.push(inputBuilder);
  });

  return inputs;
}
