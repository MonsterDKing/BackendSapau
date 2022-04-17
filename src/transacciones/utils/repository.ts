import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, paginateRaw } from 'nestjs-typeorm-paginate';
import BusquedaInterface from 'src/clientes/dto/busqueda.dto';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TransaccionEntity } from '../entities/transaccion.entity';
import { TransaccionWithMonth } from '../model/TransactionsWithMoth';
import { EstadoTransaccionEnum } from '../enums/Estado.Transaccion.enum';
import FiltradoDashboardDto from 'src/dashboard/dto/filtrado.dto';
import { FiltradoXlsDashboardDto } from 'src/dashboard/dto/dashboard.xls.dto';


@Injectable()
export class TransaccionRepository {

    constructor(
        @InjectRepository(TransaccionEntity)
        private repository: Repository<TransaccionEntity>

    ) { }

    getAll(): Promise<TransaccionEntity[]> {
        return this.repository.find();
    }

    getUltimasTransacciones(filtro: FiltradoDashboardDto): Promise<TransaccionEntity[]> {
        let queryBuilder = this.repository.createQueryBuilder("t")
            .innerJoinAndSelect("t.cliente", "c")
            .innerJoinAndSelect("t.cobrador", "cobrador")
        if (filtro.fechaInicio != " " && filtro.fechaInicio) {
            if (filtro.fechaFin != " " && filtro.fechaFin) {
                queryBuilder.andWhere('Date(trans.fecha_creacion) BETWEEN :dateone AND :datetwo')
                queryBuilder.setParameter('dateone', filtro.fechaInicio)
                queryBuilder.setParameter('datetwo', filtro.fechaFin)
            }
        } else {
            queryBuilder.limit(100);
        }
        let data = queryBuilder.getMany();
        return data;
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
            relations: ["cliente", "cobrador", "cliente.tarifa", "cliente.contratante", "cliente.colonia"]
        });
    }

    getAllByClient(cliente: ClienteEntity, estado: number): Promise<TransaccionEntity[]> {
        return this.repository.find({
            where: {
                cliente,
                estado_transaccion: estado
            },
            relations: ["cliente", "cobrador", "cliente.tarifa", "cliente.contratante",]
        });
    }

    getAllMonthByIdClientLimit(cliente: ClienteEntity): Promise<TransaccionEntity[]> {
        return this.repository.find({
            where: {
                cliente: cliente,
                estado_transaccion: EstadoTransaccionEnum.NO_PAGADO

            },
            order: {
                fecha_creacion: "DESC"
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

    deleteAllTransactionByClient(cliente: ClienteEntity): Promise<DeleteResult> {
        return this.repository.delete({
            cliente
        });
    }

    getAlltranssactionsTypeMensualidadVencidas(): Promise<TransaccionEntity[]> {
        return this.repository.createQueryBuilder("trans")
            .where("TIMESTAMPDIFF(MONTH, trans.fecha_creacion, now()) = 1 and trans.tipo_transaccion = 1")
            .getMany()
    }

    async getallTransactionsWithMonthQueryRaw(options: IPaginationOptions, busqueda?: BusquedaInterface): Promise<any> {
        let queryBuilder = await this.repository
            .createQueryBuilder("trans")
            .select("CONCAT(c.nombre,' ',c.apellidoPaterno,' ',c.apellidoMaterno) as nombre,COUNT(*) as meses,c.calle as calle,col.nombre as colonia, SUM(t.costo) deuda,t.costo costoTarifa, t.descripcion descripcionTarifa, c.id as clienteId")
            .innerJoin('trans.cliente', 'c')
            .innerJoin('c.tarifa', 't')
            .leftJoin('c.colonia', 'col')
            .where(" trans.estado_transaccion = 0")
            .groupBy("trans.clienteId")
        if (busqueda) {
            if (busqueda.nombre) {
                queryBuilder.andWhere(`c.nombre like "%${busqueda.nombre}%" `);
            }
            if (busqueda.apellidoPaterno) {
                queryBuilder.andWhere(`c.apellidoPaterno like "%${busqueda.apellidoPaterno}%" `);
            }
            if (busqueda.apellidoMaterno) {
                queryBuilder.andWhere(`c.apellidoMaterno like "%${busqueda.apellidoMaterno}%" `);
            }
            if (busqueda.calle) {
                queryBuilder.andWhere(`c.calle like "%${busqueda.calle}%" `);
            }
            if (busqueda.contrato) {
                queryBuilder.andWhere(`c.contrato like "%${busqueda.contrato}%" `);
            }
            if (busqueda.colonia) {
                queryBuilder.andWhere(`col.nombre like "%${busqueda.colonia}%" `);
            }
        }

        const result = await paginateRaw<any>(queryBuilder, options)
        return result;
    }

    async getAllDeuda(filtro: FiltradoDashboardDto): Promise<any> {
        let d = await this.repository.createQueryBuilder("trans")
            .select("SUM(trans.monto) as deuda")
            .where("trans.estado_transaccion = 0");

        if (filtro.fechaInicio != " " && filtro.fechaInicio) {
            if (filtro.fechaFin != " " && filtro.fechaFin) {
                d.andWhere('Date(trans.fecha_creacion) BETWEEN :dateone AND :datetwo')
                d.setParameter('dateone', filtro.fechaInicio)
                d.setParameter('datetwo', filtro.fechaFin)
            }
        }

        let queryBuilder = d.getRawOne()
        return queryBuilder;
    }

    async getTransaccionWithDate() {
        let querybuilder = await this.repository.createQueryBuilder("trans")
    }

    async getAllMonthDashboard(fechaUno: string, fechaDos: string) {
        let query = await this.repository.createQueryBuilder('t')
            .select("sum(t.monto) valor")
            .where("t.estado_transaccion = 1")
            .andWhere('t.fecha_pago BETWEEN :dateone AND :datetwo')
            .setParameter('dateone', fechaUno)
            .setParameter('datetwo', fechaDos)
            .getRawMany();

        return query;
    }

    async getAllTransaccionesDashboardXls(filtro: FiltradoXlsDashboardDto) {
        let query = await this.repository.createQueryBuilder('t')
            .innerJoinAndSelect("t.cliente", "c")
            .innerJoinAndSelect("t.cobrador", "co")
            .innerJoinAndSelect("c.colonia", "col")

        if (filtro.tipo == 99) {
            query.where("Date(t.fecha_creacion) BETWEEN :dateone and :datetwo ")
                .setParameter('dateone', filtro.fechaInicio)
                .setParameter('datetwo', filtro.fechaFin)
        } else {
            query.where("t.estado_transaccion = :tipo and Date(t.fecha_pago) BETWEEN :dateone and :datetwo ")
                .setParameter('tipo', filtro.tipo)
                .setParameter('dateone', filtro.fechaInicio)
                .setParameter('datetwo', filtro.fechaFin)
        }
        let data = await query.getMany();
        return data;
    }


}