// @flow
import type {
  GraphQLSchema,
} from 'graphql/type';

export type ProjectorOptions = {
  schema: GraphQLSchema,
  recursive: boolean,
};

export type ProjectorConfig = GraphQLSchema | ProjectorOptions;

export type Projection = {
  [id:string]: number
};
