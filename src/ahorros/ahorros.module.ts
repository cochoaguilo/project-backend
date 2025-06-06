import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ahorros } from './ahorros.entity';
import { AhorrosService } from './ahorros.service';
import { AhorrosController } from './ahorros-controllers/ahorros.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ahorros])],
  providers: [AhorrosService],
  controllers: [AhorrosController],
})
export class AhorrosModule {}
