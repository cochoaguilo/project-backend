import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AhorrosService } from './ahorros/ahorros.service';
import { AhorrosController } from './ahorros/ahorros-controllers/ahorros.controller';
import { DeudasController } from './controllers/deudas/deudas.controller';
import { InversionesController } from './controllers/inversiones/inversiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AhorrosModule } from './ahorros/ahorros.module';
import { DeudasModule } from './deudas/deudas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      username: 'marcosone',
      password: 'marcosdb',
      database: 'nuevaDB',
      entities: [],
      options: {
        encrypt: false, // o true si usas Azure
        trustServerCertificate: true, // ✅ esto permite certificados autofirmados
      },
      autoLoadEntities: true, // Carga automáticamente las entidades
    }),
    AhorrosModule,
    DeudasModule,
  ],
  controllers: [DeudasController, InversionesController],
  providers: [AppService],
})
export class AppModule {}
