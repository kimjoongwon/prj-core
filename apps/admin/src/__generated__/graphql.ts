/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any }
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: { input: any; output: any }
}

export type Auth = {
  __typename?: 'Auth'
  /** JWT access token */
  accessToken: Scalars['JWT']['output']
  /** JWT refresh token */
  refreshToken: Scalars['JWT']['output']
  user: User
}

export type CreateUserInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type LoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type Mutation = {
  __typename?: 'Mutation'
  createUser: User
  login: Auth
  refreshToken: Token
  signup: Auth
}

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput
}

export type MutationLoginArgs = {
  data: LoginInput
}

export type MutationRefreshTokenArgs = {
  token: Scalars['JWT']['input']
}

export type MutationSignupArgs = {
  data: SignupInput
}

export type Profile = {
  __typename?: 'Profile'
  createdAt: Scalars['DateTime']['output']
  id: Scalars['ID']['output']
  nickname: Scalars['String']['output']
  phone: Scalars['String']['output']
  updatedAt: Scalars['DateTime']['output']
  userId: Scalars['String']['output']
}

export type ProfileInput = {
  nickname: Scalars['String']['input']
  phone: Scalars['String']['input']
}

export type Query = {
  __typename?: 'Query'
  profile: Profile
  profiles: Array<Profile>
  user: User
  users: Array<User>
}

export type QueryProfileArgs = {
  id: Scalars['String']['input']
}

export type QueryUserArgs = {
  id: Scalars['String']['input']
}

export type SignupInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
  profile: ProfileInput
}

export type Token = {
  __typename?: 'Token'
  /** JWT access token */
  accessToken: Scalars['JWT']['output']
  /** JWT refresh token */
  refreshToken: Scalars['JWT']['output']
}

export type User = {
  __typename?: 'User'
  createdAt: Scalars['DateTime']['output']
  email: Scalars['String']['output']
  id: Scalars['String']['output']
  profile: Profile
  updatedAt: Scalars['DateTime']['output']
}

export type UsersQueryVariables = Exact<{ [key: string]: never }>

export type UsersQuery = {
  __typename?: 'Query'
  users: Array<{ __typename?: 'User'; id: string; email: string }>
}

export type SignupMutationVariables = Exact<{
  data: SignupInput
}>

export type SignupMutation = {
  __typename?: 'Mutation'
  signup: { __typename?: 'Auth'; accessToken: any; refreshToken: any }
}

export const UsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Users' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>
export const SignupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'signup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'SignupInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'signup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'data' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>
