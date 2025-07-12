import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AhorrosModule } from './ahorros/ahorros.module';
import { DeudasModule } from './deudas/deudas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UsuariosModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
