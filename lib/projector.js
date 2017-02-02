// @flow
import type {
  FieldNode,
  FragmentDefinitionNode,
  SelectionNode,
  SelectionSetNode,
} from 'graphql/language/ast';
import type {
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'graphql/type';
import {
  getNamedType,
} from 'graphql/type';
import type {
  Projection,
  ProjectorConfig,
  ProjectorOptions,
} from './type';
import parseOptions from './parseOptions';
import makeProjection from './makeProjection';

/**
 * Attempt to grab the type name from a GraphQL return type. E.g., if it's a null or a list
 * we only care about the inner guts.
 */
function getTypeName(returnType: GraphQLOutputType): string {
  const namedType: ?GraphQLNamedType = getNamedType(returnType);

  if (namedType) {
    return namedType.name;
  }

  throw new Error('Could not detect return type');
}

function replaceFragments(
  selectionSet: ?SelectionSetNode,
  fragments: { [fragmentName: string]: FragmentDefinitionNode },
): Array<FieldNode> {
  if (!selectionSet) {
    return [];
  }

  return selectionSet.selections.reduce((
    accumulator: Array<FieldNode>,
    selection: SelectionNode,
  ): Array<FieldNode> => {
    if (selection.kind === 'Field') {
      return [...accumulator, selection];
    }
    if (selection.kind !== 'FragmentSpread') {
      // todo: Figure out what we need to do to handle this case
      throw new Error(`Unable to handle SelectionNode of type '${selection.kind}'`);
    }

    const fragment: ?FragmentDefinitionNode = fragments[selection.name.value];
    if (!fragment) {
      throw new Error(`Unable to find fragment for selection '${selection.name.value}'`);
    }

    // Step through this fragment recursively in case it is also made up of fragments
    const fragmentSelections = replaceFragments(fragment.selectionSet, fragments);

    return [
      ...accumulator,
      ...fragmentSelections,
    ];
  }, []);
}

export default function projector(
  schemaOrOptions: ProjectorConfig,
  { fieldNodes, returnType, fragments }: GraphQLResolveInfo,
): Projection {
  const typeName: string = getTypeName(returnType);
  const options: ProjectorOptions = parseOptions(schemaOrOptions);

  const projections: Array<Projection> = fieldNodes.map((fieldNode: FieldNode): Projection => {
    // Ensure all of the selection sets through the tree aren't fragments
    const selections: Array<FieldNode> = replaceFragments(fieldNode.selectionSet, fragments);

    return selections.reduce((projection: Projection, selection: FieldNode): Projection => {
      const fields: Array<string> = makeProjection(options, typeName, selection.name);
      fields.forEach((field: string) => {
        projection[field] = 1; // eslint-disable-line no-param-reassign
      });

      return projection;
    }, {});
  });

  return projections.reduce((allProjections: Projection, projection: Projection): Projection => ({
    ...allProjections,
    ...projection,
  }), {});
}
