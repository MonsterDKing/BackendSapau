import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TransaccionEntity } from '../entities/transaccion.entity';


@Injectable()
export class TransaccionRepository {

    constructor(
        @InjectRepository(TransaccionEntity)
        private repository: Repository<TransaccionEntity>) { }

    getAll(): Promise<TransaccionEntity[]> {
        return this.repository.find();
    }

    getById(id: number): Promise<TransaccionEntity> {
        return this.repository.findOne({
            where:{
                id
            },
        });
    }

    async create(data: TransaccionEntity): Promise<TransaccionEntity> {
        return this.repository.save(data);
    }

    async update(data:TransaccionEntity): Promise<UpdateResult> {
       return await this.repository.update(data.id, data);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }



}