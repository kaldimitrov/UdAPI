import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

/* eslint-disable */
const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        migrationsTableName: 'migrations',
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        logging: false,
        synchronize: false,
        autoLoadEntities: true,
        name: 'default',
        entities: ['dist/src/**/**.entity.js'],
        migrations: ['dist/src/migrations/*.js'],
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
