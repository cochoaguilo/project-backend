import { Module } from '@nestjs/common';
import { DeudasController } from './deudas.controller';
import { DeudasService } from './deudas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deudas } from './deudas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deudas])],
  controllers: [DeudasController],
  providers: [DeudasService]
})
export class DeudasModule {}
