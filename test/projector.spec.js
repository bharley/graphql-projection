import { expect } from 'chai';
import {
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import projector from '../lib/projector';
import schema, { ActorType, FilmType, UserType } from './schema';
import argsFromQuery from './argsFromQuery';

const boundProjector = projector.bind(null, schema);

describe('projector', () => {
  it('should return no projections for an empty query', () => {
    const projection = boundProjector({
      fieldNodes: [],
      returnType: 'NotRealType',
      fragments: {},
    });

    expect(projection).to.eql({});
  });

  it('should handle basic queries', () => {
    const projection = boundProjector(argsFromQuery(UserType, `
      {
        user {
          name
        }
      }
    `));

    expect(projection).to.deep.eql({ name: 1 });
  });

  it('should handle named queries', () => {
    const projection = boundProjector(argsFromQuery(new GraphQLNonNull(UserType), `
      query GetUser {
        user {
          id
          name
        }
      }
    `));

    expect(projection).to.deep.eql({ id: 1, name: 1 });
  });

  it('should handle list results', () => {
    const projection = boundProjector(argsFromQuery(new GraphQLList(FilmType), `
      {
        movies {
          id
          name
        }
      }
    `));

    expect(projection).to.deep.eql({ id: 1, name: 1 });
  });

  it('should handle custom projections', () => {
    const projection = boundProjector(argsFromQuery(new GraphQLNonNull(UserType), `
      {
        user {
          id
          username
        }
      }
    `));

    expect(projection).to.deep.eql({ id: 1, email: 1 });
  });

  it('should support fields as a function', () => {
    const projection = boundProjector(argsFromQuery(ActorType, `
      {
        actor(id: 1) {
          id
          name
        }
      }
    `));

    expect(projection).to.deep.eql({ id: 1, firstName: 1, lastName: 1 });
  });

  it('should support fragments', () => {
    const projection = boundProjector(argsFromQuery(ActorType, `
      {
        actor(id: 1) {
          ...ActorProps
        }
      }

      fragment ActorProps on Actor {
        id
        name
        address
      }
    `));

    expect(projection).to.deep.eql({ id: 1, firstName: 1, lastName: 1, address: 1 });
  });
});
