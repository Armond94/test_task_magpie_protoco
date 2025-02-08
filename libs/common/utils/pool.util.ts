export const getPoolSyncURL = (API_KEY: string, SUBGRAPH_ID: string): string =>
  `https://gateway.thegraph.com/api/${API_KEY}/subgraphs/id/${SUBGRAPH_ID}`;
