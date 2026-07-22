import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'marcosdb',
      database: 'wallet',
      entities: [],
      autoLoadEntities: true, // Carga automáticamente las entidades
      synchronize: true, // Sincroniza automáticamente la base de datos (no recomendado en producción)
    }),
    JwtModule.register({
      global: true,
      secret: process.env.secretToken || 'default_secret',
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
