import { GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";

export const client = new GraphQLClient(endpoint, {
  headers: {
    // Add authorization headers here if needed, e.g.:
    // Authorization: `Bearer ${token}`,
  },
});
