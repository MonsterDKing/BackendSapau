import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateColoniaDto } from '../dto/create-colonia.dto';
import { ColoniaEntity } from '../entities/colonia.entity';
import { ColoniaMapper } from './colonia.mapper';
import { UpdateColoniaDto } from '../dto/update-colonia.dto';
import FiltradoDashboardDto from 'src/dashboard/dto/filtrado.dto';


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


    async getMontoByColnias(coloniaId:number,filtro:FiltradoDashboardDto){
        let d =  await this.repository.createQueryBuilder("co")
            .select("sum(t.monto) valor")
            .innerJoin("co.clientes","c")
            .innerJoin("c.transacciones","t")
            .where("t.estado_transaccion = 1")
            .andWhere("co.id = :coloniaId")
            .setParameter("coloniaId",coloniaId)
        if(filtro.fechaInicio != " " && filtro.fechaInicio){
            if(filtro.fechaFin != " " && filtro.fechaFin){
                d.andWhere('Date(t.fecha_pago) BETWEEN :dateone AND :datetwo' )
                d.setParameter('dateone',filtro.fechaInicio)
                d.setParameter('datetwo',filtro.fechaFin)
            }
        } 
        let data = d.getRawOne();
        return data;
    }

    async getDeudaByColonias(coloniaId:number,filtro:FiltradoDashboardDto){
        let d =  await this.repository.createQueryBuilder("co")
            .select("sum(t.monto) valor")
            .innerJoin("co.clientes","c")
            .innerJoin("c.transacciones","t")
            .where("t.estado_transaccion = 0 and co.id = :coloniaId")
            .setParameter("coloniaId",coloniaId)
        if(filtro.fechaInicio != " " && filtro.fechaInicio){
            if(filtro.fechaFin != " " && filtro.fechaFin){
                d.andWhere('Date(t.fecha_pago) BETWEEN :dateone AND :datetwo' )
                d.setParameter('dateone',filtro.fechaInicio)
                d.setParameter('datetwo',filtro.fechaFin)
            }
        } 
        let data = d.getRawOne();
        return data;
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }




}