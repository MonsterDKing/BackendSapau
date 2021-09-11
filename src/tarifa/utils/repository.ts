import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';
import { TarifaEntity } from '../entities/tarifa.entity';
import { TarifaMapper } from './mapper';


@Injectable()
export class TarifaRepository {

    constructor(
        @InjectRepository(TarifaEntity)
        private repository: Repository<TarifaEntity>,
        private mapper: TarifaMapper) { }

    getAll(): Promise<TarifaEntity[]> {
        return this.repository.find();
    }

    getById(id: number): Promise<TarifaEntity> {
        return this.repository.findOne({
            where:{
                id
            },
        });
    }
    

    async create(data: CreateTarifaDto): Promise<TarifaEntity> {
        const d = await this.mapper.dtoToEntity(data);
        return this.repository.save(d);
    }

    async update(id: number, data: UpdateTarifaDto): Promise<TarifaEntity> {
        data.id = id;
        const updateUser = await this.mapper.dtoToEntityUpdate(data);
        await this.repository.update(id, updateUser);
        return this.repository.findOne(id);

    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }



}