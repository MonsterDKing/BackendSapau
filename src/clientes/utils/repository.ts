import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository } from 'typeorm';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ClienteEntity } from '../entities/cliente.entity';
import { ClienteMapper } from './mapper';
import { Like } from 'typeorm';
import BusquedaInterface from '../dto/busqueda.dto';
import FiltradoDashboardDto from 'src/dashboard/dto/filtrado.dto';


@Injectable()
export class ClientesRepository {

    constructor(
        @InjectRepository(ClienteEntity)
        private repository: Repository<ClienteEntity>,
        private mapper: ClienteMapper) { }

    getAll(): Promise<ClienteEntity[]> {
        return this.repository.find({
            relations: ["contratante", "tarifa"]
        });
    }

    getAllDashboard(filtro: FiltradoDashboardDto): Promise<ClienteEntity[]> {
        let queryBuilder = this.repository.createQueryBuilder("c")

        if (filtro.fechaInicio != " " && filtro.fechaInicio) {
            if (filtro.fechaFin != " " && filtro.fechaFin) {
                queryBuilder.andWhere('Date(c.fechaDeCreacion) BETWEEN :dateone AND :datetwo')
                queryBuilder.setParameter('dateone', filtro.fechaInicio)
                queryBuilder.setParameter('datetwo', filtro.fechaFin)
            }
        }

        return queryBuilder.getMany();
    }


    async getAllPaginate(options: IPaginationOptions, busqueda?: BusquedaInterface): Promise<Pagination<ClienteEntity>> {
        let count = 0;
        if (busqueda.nombre || busqueda.apellidoPaterno || busqueda.apellidoMaterno || busqueda.calle || busqueda.contrato) {
            const queryBuilder = this.repository
                .createQueryBuilder('clients')
                .innerJoinAndSelect("clients.contratante", "usuario")
                .innerJoinAndSelect("clients.tarifa", "tarifa")
                .innerJoinAndSelect('clients.transacciones', 'transaccion')
                .innerJoinAndSelect('clients.colonia', 'colonia')
            if (busqueda) {
                if (busqueda.nombre) {
                    if (count == 0) {
                        count++;
                        queryBuilder.where(`clients.nombre like "%${busqueda.nombre}%" `);
                    } else {
                        queryBuilder.andWhere(`clients.nombre like "%${busqueda.nombre}%" `);
                    }
                }
                if (busqueda.apellidoPaterno) {
                    if (count == 0) {
                        count++;
                        queryBuilder.where(`clients.apellidoPaterno like "%${busqueda.apellidoPaterno}%" `);
                    } else {
                        queryBuilder.andWhere(`clients.apellidoPaterno like "%${busqueda.apellidoPaterno}%" `);
                    }
                }
                if (busqueda.apellidoMaterno) {
                    if (count == 0) {
                        count++;
                        queryBuilder.where(`clients.apellidoMaterno like "%${busqueda.apellidoMaterno}%" `);
                    } else {
                        queryBuilder.andWhere(`clients.apellidoMaterno like "%${busqueda.apellidoMaterno}%" `);
                    }
                }
                if (busqueda.calle) {
                    if (count == 0) {
                        count++;
                        queryBuilder.where(`clients.calle like "%${busqueda.calle}%" `);
                    } else {
                        queryBuilder.andWhere(`clients.calle like "%${busqueda.calle}%" `);
                    }
                }
                if (busqueda.contrato) {
                    if (count == 0) {
                        count++;
                        queryBuilder.where(`clients.contrato like "%${busqueda.contrato}%" `);
                    } else {
                        queryBuilder.andWhere(`clients.contrato like "%${busqueda.contrato}%" `);
                    }
                }
            }
            queryBuilder.orderBy('transaccion.fecha_creacion', 'ASC');
            const result = await paginate<ClienteEntity>(queryBuilder, options)
            return result;
        }

        return paginate(this.repository, options, {
            relations: ["contratante", "tarifa", "transacciones", "colonia"]
        });
    }

    getById(id: number): Promise<ClienteEntity> {
        return this.repository.findOne({
            where: {
                id
            },
            relations: ["contratante", "tarifa", "colonia"]
        });
    }

    getByIdWithTransactions(id: number): Promise<ClienteEntity> {
        return this.repository
            .createQueryBuilder('client')
            .innerJoinAndSelect("client.contratante", "usuario")
            .innerJoinAndSelect("client.tarifa", "tarifa")
            .leftJoinAndSelect('client.transacciones', 'transaccion')
            .leftJoinAndSelect('client.colonia', 'col')
            .where('client.id = :id', { id })
            .orderBy('transaccion.fecha_creacion', 'ASC')
            .getOne();

    }

    async create(data: CreateClienteDto): Promise<ClienteEntity> {
        const d = await this.mapper.dtoToEntity(data);
        return this.repository.save(d);
    }

    async createclean(data: ClienteEntity): Promise<ClienteEntity> {
        return this.repository.save(data);
    }

    async update(id: number, data: UpdateClienteDto): Promise<ClienteEntity> {
        data.id = id;
        const updateUser = await this.mapper.dtoToEntityUpdate(data);
        await this.repository.update(id, updateUser);
        return this.repository.findOne({
            where: {
                id
            },
            relations: ["contratante", "tarifa"]
        });
    }

    delete(id: number): Promise<DeleteResult> {
        try {
            return this.repository.delete(id);
        } catch (ex) {
            console.log(ex);
        }
    }

    async updateClean(id: number, data: ClienteEntity): Promise<ClienteEntity> {
        await this.repository.update(id, data);
        return this.repository.findOne({
            where: {
                id
            },
            relations: ["contratante", "tarifa"]
        });
    }

    async hideClient(id: number) {
        let client = await this.repository.findOne({
            where: {
                id
            },
            relations: ["contratante", "tarifa"]
        })
        if (client) {
            client.mostrar = false;
            return this.repository.update(client.id, client);
        }
    }

    async getAllPaginateAndDontHavePreviousDebit(options: IPaginationOptions, busqueda?: BusquedaInterface): Promise<any> {
        const queryBuilder = await this.repository
            .createQueryBuilder('clients')
            .innerJoinAndSelect("clients.contratante", "usuario")
            .innerJoinAndSelect("clients.tarifa", "tarifa")
            .innerJoin('clients.transacciones', 'transaccion')
            .where('transaccion.estado_transaccion = 1')

        if (busqueda) {
            if (busqueda.nombre) {
                queryBuilder.andWhere(`clients.nombre like "%${busqueda.nombre}%" `);
            }
            if (busqueda.apellidoPaterno) {
                queryBuilder.andWhere(`clients.apellidoPaterno like "%${busqueda.apellidoPaterno}%" `);
            }
            if (busqueda.apellidoMaterno) {
                queryBuilder.andWhere(`clients.apellidoMaterno like "%${busqueda.apellidoMaterno}%" `);
            }
            if (busqueda.calle) {
                queryBuilder.andWhere(`clients.calle like "%${busqueda.calle}%" `);
            }
            if (busqueda.contrato) {
                queryBuilder.andWhere(`clients.contrato like "%${busqueda.contrato}%" `);
            }
            if (busqueda.contrato) {
                queryBuilder.andWhere(`clients.contrato like "%${busqueda.contrato}%" `);
            }
            if (busqueda.colonia) {
                queryBuilder.andWhere(`clients.colonia like "%${busqueda.colonia}%" `);
            }
        }

        queryBuilder.groupBy("clients.id")
        const result = await paginate<ClienteEntity>(queryBuilder, options)
        return result;
    }

    async getAllPaginateAndHavePreviousDebit(options: IPaginationOptions, busqueda?: BusquedaInterface): Promise<any> {
        const queryBuilder = await this.repository
            .createQueryBuilder('clients')
            .innerJoinAndSelect("clients.contratante", "usuario")
            .innerJoinAndSelect("clients.tarifa", "tarifa")
            .innerJoinAndSelect("clients.colonia", "co")
            .innerJoin('clients.transacciones', 'transaccion')
            .where('transaccion.estado_transaccion = 0')

        if (busqueda) {
            if (busqueda.nombre) {
                queryBuilder.andWhere(`clients.nombre like "%${busqueda.nombre}%" `);
            }
            if (busqueda.apellidoPaterno) {
                queryBuilder.andWhere(`clients.apellidoPaterno like "%${busqueda.apellidoPaterno}%" `);
            }
            if (busqueda.apellidoMaterno) {
                queryBuilder.andWhere(`clients.apellidoMaterno like "%${busqueda.apellidoMaterno}%" `);
            }
            if (busqueda.calle) {
                queryBuilder.andWhere(`clients.calle like "%${busqueda.calle}%" `);
            }
            if (busqueda.contrato) {
                queryBuilder.andWhere(`clients.contrato like "%${busqueda.contrato}%" `);
            }
            if (busqueda.contrato) {
                queryBuilder.andWhere(`clients.contrato like "%${busqueda.contrato}%" `);
            }
            if (busqueda.colonia) {
                queryBuilder.andWhere(`co.nombre like "%${busqueda.colonia}%" `);
            }
        }
        queryBuilder.groupBy("clients.id")
        const result = await paginate<ClienteEntity>(queryBuilder, options)
        return result;
    }






}