import { Injectable } from '@nestjs/common';
import { CreateCriptoDto } from './dto/create-cripto.dto';
import { UpdateCriptoDto } from './dto/update-cripto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cripto } from './entities/cripto.entity';

@Injectable()
export class CriptoService {

  constructor(
      @InjectRepository(Cripto)
      private criptoRepository: Repository<Cripto>
    ) {
      
    }
  create(createCriptoDto: CreateCriptoDto & { userId: number }): Promise<Cripto> {
    const cripto = this.criptoRepository.create(createCriptoDto);
    return this.criptoRepository.save(cripto);
  }

  findAll(userId: number): Promise<Cripto[]> {
    return this.criptoRepository.find({ where: { userId } });
  }

  /* findOne(id: number) {
    return `This action returns a #${id} cripto`;
  } */

  async update(id: number, updateCriptoDto: CreateCriptoDto): Promise<Cripto | null> {
    await this.criptoRepository.update(id, updateCriptoDto);
    return this.criptoRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.criptoRepository.delete(id);
  }
}
