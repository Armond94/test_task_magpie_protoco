import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniswapV3Service } from './app.service';
import { PoolsEntity } from '../libs/data-layer/entities/typeorm/pool.entity';
import { PaginationRequestDto } from '../libs/common/dto/pagination.dto';
import { TickEntity } from '../libs/data-layer/entities/typeorm/tick.entity';

@Controller('')
export class AppController {
  constructor(private readonly uniswapV3Service: UniswapV3Service) {}

  @Get('/pools')
  getPoolsList(
    @Query() { page }: PaginationRequestDto,
  ): Promise<PoolsEntity[]> {
    return this.uniswapV3Service.getPools(Number(page) || 5);
  }

  @Get('/pool/:poolId/ticks')
  getTicks(
    @Param('poolId') poolId: number,
    @Query() { page }: PaginationRequestDto,
  ): Promise<TickEntity[]> {
    return this.uniswapV3Service.getTicksByPoolId(poolId, Number(page) || 5);
  }
}
