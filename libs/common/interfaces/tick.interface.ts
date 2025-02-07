export interface TickPool {
  id: string;
}

export interface Tick {
  id: string;
  liquidityGross: string;
  liquidityNet: string;
  pool: TickPool;
  tickIdx: string;
}
