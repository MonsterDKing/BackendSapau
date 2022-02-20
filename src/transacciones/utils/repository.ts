import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
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

    getAllByStatus(estado: number) {
        return this.repository.find({
            where: {
                estado_transaccion: estado
            },
            relations: ["cliente", "cobrador", "cliente.tarifa", "cliente.contratante",]
        })
    }

    getById(id: number): Promise<TransaccionEntity> {
        return this.repository.findOne({
            where: {
                id
            },
            relations: ["cliente", "cobrador", "cliente.tarifa", "cliente.contratante",]
        });
    }

    getAllMonthByIdClientLimit(cliente: ClienteEntity): Promise<TransaccionEntity[]> {
        return this.repository.find({
            where: {
                cliente
            },
            relations: ["cliente", "cobrador", "cliente.tarifa", "cliente.contratante",],
        });
    }

    async create(data: TransaccionEntity): Promise<TransaccionEntity> {
        return this.repository.save(data);
    }

    async update(data: TransaccionEntity): Promise<UpdateResult> {
        return await this.repository.update(data.id, data);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    getAlltranssactionsTypeMensualidadVencidas(): Promise<TransaccionEntity[]> {
        return this.repository.createQueryBuilder("trans")
            .where("TIMESTAMPDIFF(MONTH, ts.fecha_creacion, now()) = 1 and ts.tipo_transaccion = 1")
            .getMany()
    }

    getallTransactionsWithMonthQueryRaw(): Promise<any> {
        let d = this.repository.query(`SELECT 
        CONCAT(cl.nombre,
                ' ',
                cl.apellidoPaterno,
                ' ',
                cl.apellidoMaterno) AS nombre,
                    ts.clienteId,
                    COUNT(*) AS meses,
                    SUM(t.costo) deuda,
                    cl.calle as calle,
                    cl.colonia as colonia
                FROM
                    transaccion ts
                        INNER JOIN
                    cliente cl ON cl.id = ts.clienteId
                        INNER JOIN
                    tarifa t ON t.id = cl.tarifaId
                WHERE
                    ts.estado_transaccion = 0
                GROUP BY ts.clienteId;`)
        return d;
    }



}