import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UniswapV3Service } from './app.service';
import { DefaultDatabaseConfiguration } from '../libs/common/configuration/database.configurations';
import { PoolsEntity } from '../libs/data-layer/entities/typeorm/pool.entity';
import { TickEntity } from '../libs/data-layer/entities/typeorm/tick.entity';
import { PoolRepository } from '../libs/data-layer/repositories/typeorm/pool.repository';
import { TickRepository } from '../libs/data-layer/repositories/typeorm/tick.repository';
import { PoolSyncService } from '../libs/common/services/pool-sync.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DefaultDatabaseConfiguration(),
    TypeOrmModule.forFeature([PoolsEntity, TickEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    UniswapV3Service,
    PoolRepository,
    TickRepository,
    PoolSyncService,
  ],
  exports: [UniswapV3Service, PoolSyncService],
})
export class AppModule {}
