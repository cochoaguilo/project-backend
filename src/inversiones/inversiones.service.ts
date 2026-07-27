import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inversiones } from './inversiones.entity';
import { CreateInversionesDto } from './create-inversiones.dto';

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

  async update(id: number, updateInversionesDto: CreateInversionesDto): Promise<void> {
    await this.inversionesRepository.update(id, updateInversionesDto);
  }

  async remove(id: number) {
    return this.inversionesRepository.delete(id);
  }
}
