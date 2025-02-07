import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import 'dotenv/config';

export const DefaultDatabaseConfiguration = (): DynamicModule => {
  return TypeOrmModule.forRootAsync({
    imports: [],
    inject: [],
    useFactory: () => {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: true,
        autoLoadEntities: true,
      };
    },
  });
};
