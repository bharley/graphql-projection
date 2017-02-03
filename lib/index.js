import projector from './projector';

/**
 * We also want to expose this if people are having circular dependency
 * issues.
 */
export projector from './projector';

/**
 * Produces a projector bound to a GraphQL schema.
 */
export default function makeProjector(options) {
  return projector.bind(null, options);
}
