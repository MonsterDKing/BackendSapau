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
            relations:["contratante","tarifa"]
        });
    }

    getById(id: number): Promise<CobroEntity> {
        return this.repository.findOne({
            where:{
                id
            },
            relations:["contratante","tarifa"]
        });
    }

    // async create(data: CreateClienteDto): Promise<CobroEntity> {
    //     const d = await this.mapper.dtoToEntity(data);
    //     return this.repository.save(d);
    // }

    // async update(id: number, data: UpdateClienteDto): Promise<CobroEntity> {
    //     data.id = id;
    //     const updateUser = await this.mapper.dtoToEntityUpdate(data);
    //     await this.repository.update(id, updateUser);
    //     return this.repository.findOne({
    //         where:{
    //             id
    //         },
    //         relations:["contratante","tarifa"]
    //     });

    // }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }



}