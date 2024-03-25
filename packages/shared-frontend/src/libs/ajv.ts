import Ajv from 'ajv';
import { uniq } from 'lodash-es';

const ajv = new Ajv({ allErrors: true, strict: false });

const getPathFromError = (error: any) => {
  return error.instancePath?.split('/')?.[1];
};

const getPathsFromErrors = (errors?: any[]) => {
  if (!errors) return [];
  return errors?.map((error: any) => getPathFromError(error)) || [];
};

const getErrorFromErrorsByPath = (errors?: any[], path?: string) => {
  if (!errors) return undefined;
  return errors?.find(error => getPathFromError(error) === path);
};

const getErrorMessageFromSchemaByPath = (
  schema: any,
  path: string,
  error: any,
) => {
  const errorKeyword = error?.keyword as string;
  console.log('schema', schema);
  return (
    schema?.properties?.[path]?.errorMessage?.[errorKeyword] ||
    error?.message
  );
};

const getErrorMessages = (target: any, schema: any) => {
  const validate = ajv.compile(schema!);
  const valid = validate(target);
  let errorMessages: string[] = [];
  if (!valid) {
    const errorPaths = uniq(getPathsFromErrors(validate.errors!));

    errorPaths?.forEach(path => {
      const errorMessage = getErrorMessageFromSchemaByPath(
        schema,
        path,
        getErrorFromErrorsByPath(validate.errors!, path),
      );

      errorMessages.push(errorMessage);
    });

    return {
      valid,
      errorMessages,
    };
  }

  return {
    valid,
    errorMessages,
  };
};

export {
  ajv,
  getErrorMessages,
  getPathFromError,
  getPathsFromErrors,
  getErrorFromErrorsByPath,
  getErrorMessageFromSchemaByPath,
};
