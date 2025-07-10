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

    create(createDeudaDto: CreateDeudaDto) {
        const deuda = this.deudasRepository.create(createDeudaDto);
        return this.deudasRepository.save(deuda);
    }

    findAll(): Promise<Deudas[]> {
        return this.deudasRepository.find();
    }

    findOne(id: number) {
        return this.deudasRepository.findOneBy({ id });
    }

    /* async update(id: number, updateDeudaDto: UpdateDeudaDto) {
        await this.deudasRepository.update(id, updateDeudaDto);
        return this.findOne(id);
    } */

    remove(id: number) {
        return this.deudasRepository.delete(id);
    }
}
