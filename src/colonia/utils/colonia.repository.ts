import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateColoniaDto } from '../dto/create-colonia.dto';
import { ColoniaEntity } from '../entities/colonia.entity';
import { ColoniaMapper } from './colonia.mapper';
import { UpdateColoniaDto } from '../dto/update-colonia.dto';


@Injectable()
export class ColoniaRepository {

    constructor(
        @InjectRepository(ColoniaEntity)
        private repository: Repository<ColoniaEntity>,
        private mapper: ColoniaMapper) { }

    getAll(): Promise<ColoniaEntity[]> {
        return this.repository.find();
    }

    getById(id: number): Promise<ColoniaEntity> {
        return this.repository.findOne({
            where:{
                id
            },
        });
    }

    getByNombre(nombre:string):Promise<ColoniaEntity>{
        return this.repository.findOne({
            where:{
                nombre
            }
        })
    }
    

    async create(data: CreateColoniaDto): Promise<ColoniaEntity> {
        const d = await this.mapper.dtoToEntity(data);
        return this.repository.save(d);
    }

    async update(id: number, data: UpdateColoniaDto): Promise<ColoniaEntity> {
        data.id = id;
        const updateUser = await this.mapper.dtoToEntityUpdate(data);
        await this.repository.update(id, updateUser);
        return this.repository.findOne(id);

    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }




}