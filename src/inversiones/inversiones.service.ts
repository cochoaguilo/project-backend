import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inversiones } from './inversiones.entity';
import { CreateInversionesDto } from './create-inversiones.dto';
import { removeOwned, updateOwned } from 'src/utils/owned-record';

@Injectable()
export class InversionesService {
  constructor(
    @InjectRepository(Inversiones)
    private readonly inversionesRepository: Repository<Inversiones>,
  ) {}

  create(createInversionesDto: CreateInversionesDto & { userId: number }): Promise<Inversiones> {
    const inversion = this.inversionesRepository.create(createInversionesDto);
    return this.inversionesRepository.save(inversion);
  }

  findAll(userId: number): Promise<Inversiones[]> {
    return this.inversionesRepository.find({ where: { userId } });
  }

  update(id: number, userId: number, updateInversionesDto: CreateInversionesDto): Promise<Inversiones> {
    return updateOwned(this.inversionesRepository, id, userId, updateInversionesDto);
  }

  remove(id: number, userId: number) {
    return removeOwned(this.inversionesRepository, id, userId);
  }
}
