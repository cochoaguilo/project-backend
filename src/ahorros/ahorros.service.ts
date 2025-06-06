import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ahorros } from './ahorros.entity';
import { Repository } from 'typeorm';
import { Ahorro } from './ahorro.interface';

@Injectable()
export class AhorrosService {
    private readonly ahorros: Ahorro[] = [];

  constructor(
    @InjectRepository(Ahorros)
    private ahorrosRepository: Repository<Ahorros>
  ) {
    
  }

  create(ahorro: Ahorro) {
    this.ahorrosRepository.save(ahorro);
    this.ahorros.push(ahorro);
  }

   findAll(): Promise<Ahorros[]> {
    return this.ahorrosRepository.find();
  }
}
