export interface Token {
  symbol: string;
}

export interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  feeTier: string;
  liquidity: string;
  sqrtPrice: string;
}
