import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { PoolsEntity } from './pool.entity';

@Entity('ticks')
export class TickEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  poolId: number;

  @Column({ type: 'varchar', nullable: false })
  tickId: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  liquidityGross: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  liquidityNet: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  tickIdx: string;

  @ManyToOne(() => PoolsEntity, (pool) => pool.ticks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pool: Relation<PoolsEntity>;
}
