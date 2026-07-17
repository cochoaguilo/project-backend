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


  create(createAhorroDto: CreateAhorroDto & { userId: number }): Promise<Ahorros> {
    const ahorro = this.ahorrosRepository.create(createAhorroDto);
    return this.ahorrosRepository.save(ahorro);
  }
  
  findAll(userId: number): Promise<Ahorros[]> {
    return this.ahorrosRepository.find({ where: { userId } });
  }

  async getAhorrosTotales(userId: number): Promise<number> {
    const result = await this.ahorrosRepository
    .createQueryBuilder('ahorros')
    .select(`SUM(CASE WHEN ahorros.type = 'ingreso' THEN ahorros.quantity ELSE 0 END) - 
       SUM(CASE WHEN ahorros.type = 'egreso' THEN ahorros.quantity ELSE 0 END)`,
      'total',)
    .where('ahorros.userId = :userId', { userId })
    .getRawOne();

    const total = Number(result.total);
    return total;
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
