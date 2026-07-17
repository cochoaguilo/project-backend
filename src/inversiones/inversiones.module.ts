import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversionesController } from './inversiones.controller';
import { InversionesService } from './inversiones.service';
import { Inversiones } from './inversiones.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule,TypeOrmModule.forFeature([Inversiones])],
  controllers: [InversionesController],
  providers: [InversionesService],
})
export class InversionesModule {}
