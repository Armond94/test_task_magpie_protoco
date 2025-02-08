import { Injectable } from '@nestjs/common';
import { PoolRepository } from '../libs/data-layer/repositories/typeorm/pool.repository';
import { PoolsEntity } from '../libs/data-layer/entities/typeorm/pool.entity';
import { TickRepository } from '../libs/data-layer/repositories/typeorm/tick.repository';
import { Pool } from '../libs/common/interfaces/pool.interface';
import { Tick } from '../libs/common/interfaces/tick.interface';
import { devConfig } from '../libs/common/env-config/dev.configuration';
import { TickEntity } from '../libs/data-layer/entities/typeorm/tick.entity';

@Injectable()
export class UniswapV3Service {
  constructor(
    private readonly poolRepository: PoolRepository,
    private readonly tickRepository: TickRepository,
  ) {}

  async filterPools(poolsPayload: Pool[]): Promise<Pool[]> {
    const pools = await this.poolRepository.findPoolsByAddresses(
      poolsPayload.map((pool) => pool.id),
    );

    const poolsIds = pools.map((pool) => pool.pool_address);
    return poolsPayload.filter((pool) => !poolsIds.includes(pool.id));
  }

  async createPools(pools: Pool[]): Promise<void> {
    try {
      const poolsPayloads = pools.map((pool) =>
        this.poolRepository.create({
          pool_address: pool.id,
          token0: pool.token0.symbol,
          token1: pool.token1.symbol,
          fee_tier: pool.feeTier,
          liquidity: pool.liquidity,
          sqrt_price: pool.sqrtPrice,
        }),
      );

      await this.poolRepository.createPools(poolsPayloads);
    } catch (error) {
      console.error('Error creating pools:', error);
      throw new Error('Failed to create pools');
    }
  }

  async createTicks(ticks: Tick[]): Promise<void> {
    try {
      const pools = await this.poolRepository.findPoolsByAddresses(
        ticks.map((tick) => tick.pool.id),
      );

      const ticksPayloads = ticks.map((tick) =>
        this.tickRepository.create({
          poolId: pools.find((pool) => pool.pool_address === tick.pool.id).id,
          tickId: tick.id,
          liquidityGross: tick.liquidityGross,
          liquidityNet: tick.liquidityNet,
          tickIdx: tick.tickIdx,
        }),
      );

      await this.tickRepository.createTicks(ticksPayloads);
    } catch (error) {
      console.error('Error creating pools:', error);
      throw new Error('Failed to create pools');
    }
  }

  async getPools(page: number): Promise<PoolsEntity[]> {
    const pageSize = devConfig.POOL_LIST_PAGE_SIZE;
    return this.poolRepository.findPools(page, pageSize);
  }

  async getTicksByPoolId(poolId: number, page: number): Promise<TickEntity[]> {
    const pageSize = devConfig.TICK_LIST_PAGE_SIZE;
    return this.tickRepository.findTicksByPoolId(poolId, page, pageSize);
  }
}
