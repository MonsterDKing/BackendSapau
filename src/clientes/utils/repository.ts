import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ClienteEntity } from '../entities/cliente.entity';
import { ClienteMapper } from './mapper';


@Injectable()
export class ClientesRepository {

    constructor(
        @InjectRepository(ClienteEntity)
        private repository: Repository<ClienteEntity>,
        private mapper: ClienteMapper) { }

    getAll(): Promise<ClienteEntity[]> {
        return this.repository.find({
            relations:["contratante","tarifa"]
        });
    }

    getById(id: number): Promise<ClienteEntity> {
        return this.repository.findOne({
            where:{
                id
            },
            relations:["contratante","tarifa"]
        });
    }

    async create(data: CreateClienteDto): Promise<ClienteEntity> {
        const d = await this.mapper.dtoToEntity(data);
        return this.repository.save(d);
    }

    async update(id: number, data: UpdateClienteDto): Promise<ClienteEntity> {
        data.id = id;
        const updateUser = await this.mapper.dtoToEntityUpdate(data);
        await this.repository.update(id, updateUser);
        return this.repository.findOne({
            where:{
                id
            },
            relations:["contratante","tarifa"]
        });

    }

    delete(id: number): Promise<DeleteResult> {
        try{
            return this.repository.delete(id);
        }catch(ex){
            console.log(ex);
        }
    }



}