import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { AhorrosModule } from './ahorros/ahorros.module';
import { DeudasModule } from './deudas/deudas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthMiddleware } from './middleware/jwt-auth-middleware.middleware';
import { JwtModule } from '@nestjs/jwt';
import { CriptoModule } from './cripto/cripto.module';
import { InversionesModule } from './inversiones/inversiones.module';
import { AhorrosController } from './ahorros/ahorros-controllers/ahorros.controller';
import { InversionesController } from './inversiones/inversiones.controller';
import { CriptoController } from './cripto/cripto.controller';
import { DeudasController } from './deudas/deudas.controller';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ExternalsModule } from './externals/externals.module';

const sslConfig =
  process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
        ...(process.env.DB_SSL_CA_PATH
          ? (() => {
              const caPath = path.resolve(process.env.DB_SSL_CA_PATH);
              return existsSync(caPath)
                ? { ca: readFileSync(caPath) }
                : {};
            })()
          : {}),
      }
    : false;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: ((process.env.DB_TYPE || 'mariadb') as any) || 'mariadb',
      host: (process.env.DB_HOST || 'localhost'),
      port: Number((process.env.DB_PORT || '3306')),
      username: (process.env.DB_USERNAME || 'root'),
      password: (process.env.DB_PASSWORD || 'marcosdb'),
      database: (process.env.DB_NAME || 'wallet'),
      entities: [],
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      ssl: {
    rejectUnauthorized: false,
  },
      extra: {
        connectionLimit: 10,
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_TOKEN || process.env.secretToken || 'default_secret',
      signOptions: { expiresIn: '6000s' },
    }),
    AhorrosModule,
    DeudasModule,
    UsuariosModule,
    CriptoModule,
    InversionesModule,
    ExternalsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        AhorrosController,
        DeudasController,
        CriptoController,
        InversionesController,
      );
  }
}
