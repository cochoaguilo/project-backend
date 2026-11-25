import { Injectable } from '@nestjs/common';
import { CreateCriptoDto } from './dto/create-cripto.dto';
import { UpdateCriptoDto } from './dto/update-cripto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cripto } from './entities/cripto.entity';
import { removeOwned, updateOwned } from '../utils/owned-record';

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

  update(id: number, userId: number, updateCriptoDto: CreateCriptoDto): Promise<Cripto> {
    return updateOwned(this.criptoRepository, id, userId, updateCriptoDto);
  }

  remove(id: number, userId: number) {
    return removeOwned(this.criptoRepository, id, userId);
  }
}
