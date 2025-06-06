import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAhorroDto } from 'src/ahorros/create-ahorro.dto';
import { Ahorro } from 'src/ahorros/ahorro.interface';
import { AhorrosService } from 'src/ahorros/ahorros.service';
import { Ahorros } from '../ahorros.entity';

@Controller('ahorros')
export class AhorrosController {
  constructor(private ahorrosService: AhorrosService) {}
  @Post()
  async create(@Body() ahorrosDto: CreateAhorroDto) {
    this.ahorrosService.create(ahorrosDto);
  }
  @Get()
  async findAll(): Promise<Ahorros[]> {
    return this.ahorrosService.findAll();
  }
}
