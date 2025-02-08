import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GraphQLClient, gql } from 'graphql-request';
import { UniswapV3Service } from '../../../src/app.service';
import { Pool } from '../interfaces/pool.interface';
import { Tick } from '../interfaces/tick.interface';
import { devConfig } from '../env-config/dev.configuration';
import { getPoolSyncURL } from '../utils/pool.util';

@Injectable()
export class PoolSyncService {
  private readonly client: GraphQLClient;
  constructor(private readonly uniswapV3Service: UniswapV3Service) {
    this.client = new GraphQLClient(
      getPoolSyncURL(process.env.API_KEY, process.env.SUBGRAPH_ID),
    );
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncPools() {
    // add better logs
    console.log('Starting uniswap pool sync');
    const pools = await this.fetchPools();
    const filteredPools = await this.uniswapV3Service.filterPools(pools);

    if (!filteredPools.length) {
      return;
    }

    const ticks = await this.fetchTicks(filteredPools.map((pool) => pool.id));

    await this.uniswapV3Service.createPools(filteredPools);
    await this.uniswapV3Service.createTicks(ticks);
  }

  async fetchPools(): Promise<Pool[]> {
    const chunkSize = devConfig['POOL_SYNC_CHUNK_SIZE'];
    const totalFetchCount = Number(process.env.POOL_TOTAL_FETCH_COUNT);

    let allPools: Pool[] = [];
    let skip = 0;

    const query = gql`
      query GetPools($first: Int!, $skip: Int!) {
        pools(first: $first, skip: $skip) {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          feeTier
          liquidity
          sqrtPrice
        }
      }
    `;

    try {
      while (allPools.length < chunkSize * totalFetchCount) {
        const data = await this.client.request<{ pools: Pool[] }>(query, {
          first: chunkSize,
          skip,
        });

        if (data.pools.length === 0) {
          break;
        }

        allPools = [...allPools, ...data.pools];
        skip += chunkSize;
      }

      return allPools;
    } catch (error) {
      console.error('Error fetching pools:', error.message);
      throw error;
    }
  }

  async fetchTicks(poolIds: string[]): Promise<Tick[]> {
    const query = `
      query GetTicksForPools($poolIds: [ID!]) {
        ticks(where: { pool_in: $poolIds }) {
          id
            tickIdx
            liquidityGross
            liquidityNet
            pool {
              id
            }
        }
      }
    `;

    try {
      const data = await this.client.request<{ ticks: Tick[] }>(query, {
        poolIds,
      });
      return data.ticks;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
