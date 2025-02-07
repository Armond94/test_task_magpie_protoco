import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  Relation,
} from 'typeorm';
import { TickEntity } from './tick.entity';

@Entity('pools')
export class PoolsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000, nullable: false, unique: true })
  pool_address: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  token0: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  token1: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  fee_tier: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  liquidity: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  sqrt_price: string;

  @OneToMany(() => TickEntity, (tick) => tick.pool, {
    onDelete: 'CASCADE',
  })
  ticks: Relation<TickEntity>[];
}
