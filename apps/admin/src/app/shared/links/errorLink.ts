import { onError } from '@apollo/client/link/error';
import { isServer } from '../utils/isServer';

interface OriginalError {
  statusCode: number;
  message: string;
}

export const errorLink = onError(
  ({ graphQLErrors, networkError, response }) => {
    if (response?.errors && response?.errors?.length > 0) {
      response?.errors?.forEach(error => {
        console.log(error.extensions['originalError']);
        const originalError = error.extensions[
          'originalError'
        ] as OriginalError;

        if (isServer()) {
          return;
        }

        if (originalError && originalError['statusCode'] === 401) {
          const { search, pathname } = window.location;
          return (window.location.href =
            '/auth/login?redirect=' + pathname + search);
        }
      });
    }

    if (graphQLErrors)
      graphQLErrors?.forEach(
        ({
          message,
          locations,
          path,
          stack,
          name,
          originalError,
          nodes,
          cause,
          source,
        }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
              locations,
            )}, Path: ${path} stack: ${stack} name: ${name} originalError: ${originalError} nodes: ${nodes} cause: ${cause} source: ${source}`,
          ),
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  },
);
