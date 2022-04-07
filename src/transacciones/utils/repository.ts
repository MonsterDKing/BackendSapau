import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, paginateRaw } from 'nestjs-typeorm-paginate';
import BusquedaInterface from 'src/clientes/dto/busqueda.dto';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TransaccionEntity } from '../entities/transaccion.entity';
import { TransaccionWithMonth } from '../model/TransactionsWithMoth';
import { EstadoTransaccionEnum } from '../enums/Estado.Transaccion.enum';


@Injectable()
export class TransaccionRepository {

    constructor(
        @InjectRepository(TransaccionEntity)
        private repository: Repository<TransaccionEntity>

    ) { }

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
                cliente:cliente,
                estado_transaccion:EstadoTransaccionEnum.NO_PAGADO
                
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

    async getAllDeuda():Promise<any>{
        let queryBuilder = await this.repository.createQueryBuilder("trans").select("SUM(trans.monto) as deuda").where("trans.estado_transaccion = 0").getRawOne();
        return queryBuilder;
    }

    async getAllMonthDashboard(fechaUno:string,fechaDos:string){
        let query = await this.repository.createQueryBuilder('t')
            .select("sum(t.monto) valor")
            .where("t.estado_transaccion = 1")
            .andWhere('t.fecha_pago BETWEEN :dateone AND :datetwo' )
            .setParameter('dateone',fechaUno)
            .setParameter('datetwo',fechaDos)
            .getRawMany();

            return query;

    }


}