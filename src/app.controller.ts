import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniswapV3Service } from './app.service';
import { PoolsEntity } from '../libs/data-layer/entities/typeorm/pool.entity';
import { PaginationRequestDto } from '../libs/common/dto/pagination.dto';

@Controller('')
export class AppController {
  constructor(private readonly uniswapV3Service: UniswapV3Service) {}

  @Get('/pools')
  getPoolsList(
    @Query() { page }: PaginationRequestDto,
  ): Promise<PoolsEntity[]> {
    return this.uniswapV3Service.getPools(Number(page));
  }

  @Get('/pool/:poolId/ticks')
  getTicks(@Param('poolId') poolId: number): Promise<PoolsEntity> {
    return this.uniswapV3Service.getPoolTicks(poolId);
  }
}
