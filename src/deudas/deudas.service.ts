import { Injectable } from '@nestjs/common';
import { Deudas } from './deudas.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeudaDto } from './deudas.dto';

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

    findOne(id: number) {
        return this.deudasRepository.findOneBy({ id });
    }

    async update(id: number, updateDeudaDto: any): Promise<Deudas> {
        const result = await this.deudasRepository.update(id, updateDeudaDto);
        return result.raw;
    }

    async getDeudasTotales(userId: number): Promise<number | null> {
        console.log(userId);
        
        const result = await this.deudasRepository.sum('amount', {userId})
        console.log(result);
        
        return result;
    }

    remove(id: number) {
        return this.deudasRepository.delete(id);
    }
}
