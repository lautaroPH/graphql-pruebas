import { ApolloServer, gql } from 'apollo-server';
import axios from 'axios';

const typeDefs = gql`
  type Character {
    name: String!
    status: String!
    species: String!
    image: String!
    episode: [String]!
    id: ID!
  }

  type Query {
    characterCount: Int!
    hasNextPage(page: Int!): String
    allCharacter(page: Int!): [Character]
    findCharacter(name: String!): [Character]
    characterById(id: ID!): Character
  }
`;

const getData = async (page = 0) => {
  return await axios.get(
    `https://rickandmortyapi.com/api/character?page=${page}`
  );
};

const resolvers = {
  Query: {
    characterCount: async () => {
      const rickAndMortyData = await getData();

      return rickAndMortyData.data.info.count;
    },
    hasNextPage: async (root, args) => {
      const { page } = args;

      try {
        const rickAndMortyData = await getData(page);
        const nextPage = rickAndMortyData.data.info.next;

        return nextPage;
      } catch (error) {
        return null;
      }
    },
    allCharacter: async (root, args) => {
      const { page } = args;

      try {
        const rickAndMortyData = await getData(page);

        const dataResults = rickAndMortyData.data.results;
        const nextPage = rickAndMortyData.data.info.next;

        return dataResults;
      } catch (error) {
        return null;
      }
    },
    findCharacter: async (root, args) => {
      const { name } = args;
      try {
        const rickAndMortyData = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${name}`
        );
        return rickAndMortyData.data.results;
      } catch (error) {
        return null;
      }
    },
    characterById: async (root, args) => {
      const { id } = args;
      try {
        const rickAndMortyData = await axios.get(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        return rickAndMortyData.data;
      } catch (error) {
        return null;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen();
