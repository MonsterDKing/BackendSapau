import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CobroEntity } from '../entities/cobro.entity';

@Injectable()
export class CobroRepository {

    constructor(
        @InjectRepository(CobroEntity)
        private repository: Repository<CobroEntity>
    ) { }

    getAll(): Promise<CobroEntity[]> {
        return this.repository.find({
            relations: ["contratante", "tarifa"]
        });
    }

    getById(id: number): Promise<CobroEntity> {
        return this.repository.findOne({
            where: {
                id
            },
            relations: ["cliente", "cobrador", "transacciones", "cliente.tarifa", "cliente.contratante", "transacciones.cliente", "transacciones.cliente.tarifa","cliente.colonia",]
        });
    }

    async create(data: CobroEntity): Promise<CobroEntity> {
        return this.repository.save(data);
    }



    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }



}