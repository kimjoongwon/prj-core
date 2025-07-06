import 'reflect-metadata';

const ERROR_MESSAGE_KEY = Symbol('errorMessage');

export function ErrorMessage(message): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(ERROR_MESSAGE_KEY, message, target, propertyKey);
  };
}

export function getErrorMessage(target: Object, propertyKey: string | symbol): string | undefined {
  return Reflect.getMetadata(ERROR_MESSAGE_KEY, target, propertyKey);
}

export function getAllMetadata(target: Object): Record<string, any> {
  const metadata: Record<string, any> = {};

  for (const propertyKey of Object.getOwnPropertyNames(target)) {
    const keys = Reflect.getMetadataKeys(target, propertyKey);
    metadata[propertyKey] = keys.reduce((acc, key) => {
      acc[key] = Reflect.getMetadata(key, target, propertyKey);
      return acc;
    }, {});
  }

  return metadata;
}
