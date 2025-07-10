import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ahorros } from './ahorros.entity';
import { Repository } from 'typeorm';
import { Ahorro } from './ahorro.interface';
import { CreateAhorroDto } from './create-ahorro.dto';

@Injectable()
export class AhorrosService {
    private readonly ahorros: Ahorro[] = [];

  constructor(
    @InjectRepository(Ahorros)
    private ahorrosRepository: Repository<Ahorros>
  ) {
    
  }


  create(createAhorroDto: CreateAhorroDto): Promise<Ahorros> {
    const ahorro = this.ahorrosRepository.create(createAhorroDto);
    return this.ahorrosRepository.save(ahorro);
  }
  
  findAll(): Promise<Ahorros[]> {
    return this.ahorrosRepository.find();
  }

  /* findOne(id: number): Promise<Ahorros> {
    return this.ahorrosRepository.findOneBy({ id });
  } */

  async update(id: number, updateAhorroDto: Partial<CreateAhorroDto>): Promise<void> {
    await this.ahorrosRepository.update(id, updateAhorroDto);
  }

  async remove(id: number): Promise<void> {
    await this.ahorrosRepository.delete(id);
  }
}
