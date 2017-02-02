// @flow
import type {
  NameNode,
} from 'graphql/language/ast';
import type {
  GraphQLNamedType,
} from 'graphql/type';
import {
  GraphQLObjectType,
} from 'graphql';
import type {
  ProjectorOptions,
} from './type';

/**
 * Sometimes a GraphQL type is a computed value, so the projection can't be based off of the
 * field name. Thus, you can customize the projection for a field by providing a projection.
 */
export default function makeProjection(
  options: ProjectorOptions,
  typeName: string,
  nameNode: NameNode,
): Array<string> {
  const fieldName: string = nameNode.value;
  /* eslint-disable no-underscore-dangle */
  const type: ?GraphQLNamedType = options.schema._typeMap[typeName];

  if (!(type instanceof GraphQLObjectType)) {
    return [fieldName];
  }

  const field: ?Object = type.getFields()[fieldName];
  /* eslint-enable no-underscore-dangle */
  if (!field || !field.projection) {
    return [fieldName];
  }

  if (Array.isArray(field.projection)) {
    return field.projection;
  }

  return field.projection.split(' ');
}
