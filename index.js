import { ApolloServer, gql, UserInputError } from "apollo-server";
import { v1 } from "uuid";

const persons = [
  {
    name: "jaja",
    phone: "04343-43141",
    street: "berisso",
    city: "la plata",
    id: "3dsadmn3d3ldmasdd3",
  },
  {
    name: "sadas",
    phone: "04312343-43141",
    street: "sawd",
    city: "bersso",
    id: "3dsa123dmn3341d3ldmasasddd3",
  },
  {
    name: "midu",
    street: "dsbbbv",
    city: "la sad",
    id: "3dsa335345dm12315425n3d3ldmasdd3",
  },
];

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) return persons;

      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;

      return persons.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError("name must be unique", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: v1() };
      persons.push(person);
      return person;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`);
});
