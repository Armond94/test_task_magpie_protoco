import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TickEntity } from '../../entities/typeorm/tick.entity';

@Injectable()
export class TickRepository {
  constructor(
    @InjectRepository(TickEntity)
    private readonly repository: Repository<TickEntity>,
  ) {}

  create(data: Partial<TickEntity>): TickEntity {
    return this.repository.create(data);
  }

  async createTicks(data: Partial<TickEntity[]>): Promise<void> {
    await this.repository.save(data);
  }

  async findTicksByPoolId(
    poolId: number,
    page: number,
    pageSize: number,
  ): Promise<TickEntity[]> {
    return this.repository.find({
      where: { poolId },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }
}
