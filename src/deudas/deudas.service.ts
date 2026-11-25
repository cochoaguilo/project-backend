import { Injectable } from '@nestjs/common';
import { Deudas } from './deudas.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeudaDto } from './deudas.dto';
import { findOwned, removeOwned, updateOwned } from 'src/utils/owned-record';

@Injectable()
export class DeudasService {
    constructor(
        @InjectRepository(Deudas)
        private deudasRepository: Repository<Deudas>,
    ) {}

    create(createDeudaDto: CreateDeudaDto & { userId: number }) {
        const deuda = this.deudasRepository.create(createDeudaDto);
        return this.deudasRepository.save(deuda);
    }

    findAll(userId: number): Promise<Deudas[]> {
        return this.deudasRepository.find({ where: { userId } });
    }

    findOne(id: number, userId: number): Promise<Deudas> {
        return findOwned(this.deudasRepository, id, userId);
    }

    update(id: number, userId: number, updateDeudaDto: Partial<CreateDeudaDto>): Promise<Deudas> {
        return updateOwned(this.deudasRepository, id, userId, updateDeudaDto);
    }

    async getDeudasTotales(userId: number): Promise<number | null> {        
        const result = await this.deudasRepository.sum('amount', {userId})        
        return result;
    }

    remove(id: number, userId: number) {
        return removeOwned(this.deudasRepository, id, userId);
    }
}
