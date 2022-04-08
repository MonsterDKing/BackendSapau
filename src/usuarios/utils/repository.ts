import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UsuarioEntity } from '../entities/usuario.entity';
import { UsuarioMapper } from './mapper';


@Injectable()
export class UsuarioRepository {

    constructor(
        @InjectRepository(UsuarioEntity)
        private repository: Repository<UsuarioEntity>,
        private mapper: UsuarioMapper) { }

    getAll(): Promise<UsuarioEntity[]> {
        return this.repository.find();
    }

    getById(id: number): Promise<UsuarioEntity> {
        return this.repository.findOne({
            where:{
                id
            }
        });
    }

    create(data: CreateUsuarioDto): Promise<UsuarioEntity> {
        const d = this.mapper.dtoToEntity(data);
        return this.repository.save(d);
    }

    async update(id: number, data: UpdateUsuarioDto): Promise<UsuarioEntity> {
        data.id = id;
        const updateUser = this.mapper.dtoToEntityUpdate(data);
        await this.repository.update(id, updateUser);
        return this.repository.findOne(id);

    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }


    getByEmail(email: string): Promise<UsuarioEntity> {
        return this.repository.findOne({
            where: {
                email
            }, 
        });
    }


    getCobradoresConMonto(){
        return this.repository.createQueryBuilder("u")
        .select("u.nombre,SUM(t.monto) valor")
        .innerJoin("u.transacciones",'t')
        .where("t.estado_transaccion = 1")
        .groupBy("u.id")
        .getRawMany();
    }



}