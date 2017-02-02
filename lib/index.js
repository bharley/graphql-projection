import projector from './projector';

/**
 * Produces a projector bound to a GraphQL schema.
 */
export default function makeProjector(options) {
  return projector.bind(null, options);
}
