import { Injectable } from '@nestjs/common';
import { Deuda } from './deudas.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeudaDto } from './deudas.dto';

@Injectable()
export class DeudasService {
    constructor(
        @InjectRepository(Deuda)
        private deudasRepository: Repository<Deuda>,
    ) {}

    create(createDeudaDto: CreateDeudaDto) {
        const deuda = this.deudasRepository.create(createDeudaDto);
        return this.deudasRepository.save(deuda);
    }

    findAll() {
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
