// @flow
import { GraphQLSchema } from 'graphql';
import type {
  ProjectorConfig,
  ProjectorOptions,
} from './type';

function mixinDefaults(options: Object): ProjectorOptions {
  return {
    // recursive: false, -- todo: Implement this feature
    ...options,
  };
}

export default function parseOptions(schemaOrOptions: ProjectorConfig) {
  if (schemaOrOptions instanceof GraphQLSchema) {
    return mixinDefaults({
      schema: schemaOrOptions,
    });
  }

  return mixinDefaults(schemaOrOptions);
}
