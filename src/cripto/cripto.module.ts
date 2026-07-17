import { Module } from '@nestjs/common';
import { CriptoService } from './cripto.service';
import { CriptoController } from './cripto.controller';
import { Cripto } from './entities/cripto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cripto])],
  controllers: [CriptoController],
  providers: [CriptoService],
})
export class CriptoModule {}
