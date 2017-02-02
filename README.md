# graphql-projection

Produces a MongoDB projection by parsing the GraphQL query in a resolve function to
help to provide a concise query to MongoDB.

## Installation

Install with yarn:

```bash
$ yarn add graphql-projection
```

or npm:

```bash
$ npm i -S graphql-projection
```

Now you can set create the projection function by feeding in your schema:

```js
import makeProjector from 'graphql-projection';
import schema from './path/to/schema';

const projector = makeProjector(schema);

// ...
```

## Basic Usage

In your resolve functions in your queries, you can use this function on the resolve info (the
4th argument to your resolve function) to produce a MongoDB projection:

```js
// ...
    {
      type: FoodType,
      args: {
        id: {
          name: 'ID of food to look up',
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: (root, { id }, request, resolveInfo) => {
        const projection = projector(resolveInfo);
        
        return db.collection('foods').find({ _id: id }, projection);
      },
    }
// ...
```

## Custom Projections

Not all GraphQL fields will map 1-to-1 with their database counterparts. If you have a computed
field, you can specify the projection that should be used for it by adding a `projection`
property alongside the field's type definition:

```js
const FoodType = new GraphQLObjectType({
  name: 'Food',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    reviews: { type: new GraphQLList(ReviewType) },
    averageRating: { type: new GraphQLNonNull(GraphQLInt), projection: 'reviews' },
  }),
});
```

Projection can either be an array of strings that will be added to the projection result (e.g.,
`['property_1', 'property_2', 'property_3']`), or a space-separated string (e.g.,
`'property_1 property_2 property_3'`).

## Contributing

Pull requests are welcome. This project uses [eslint] to ensure a standardized code style, [flow]
to take advantage of all of the flow types GraphQL exports, and [Mocha]+[Chai] for tests.

[eslint]: http://eslint.org/
[flow]: https://flowtype.org/
[Mocha]: https://mochajs.org/
[Chai]: http://chaijs.com/
