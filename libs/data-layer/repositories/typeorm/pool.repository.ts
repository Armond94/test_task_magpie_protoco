import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PoolsEntity } from '../../entities/typeorm/pool.entity';

@Injectable()
export class PoolRepository {
  constructor(
    @InjectRepository(PoolsEntity)
    private readonly repository: Repository<PoolsEntity>,
  ) {}

  create(pool: Partial<PoolsEntity>): PoolsEntity {
    return this.repository.create(pool);
  }

  async createPools(data: Partial<PoolsEntity[]>): Promise<PoolsEntity[]> {
    return this.repository.save(data);
  }

  async createPool(data: Partial<PoolsEntity>): Promise<PoolsEntity> {
    return this.repository.save(data);
  }

  async findPools(page: number, pageSize: number): Promise<PoolsEntity[]> {
    console.log(page, pageSize);
    return this.repository.find({
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async findTicksByPoolId(poolId: number): Promise<PoolsEntity> {
    return this.repository.findOne({
      where: { id: poolId },
      relations: { ticks: true },
    });
  }

  async findPoolsByAddresses(ids: string[]): Promise<PoolsEntity[]> {
    return this.repository.find({ where: { pool_address: In(ids) } });
  }
}
