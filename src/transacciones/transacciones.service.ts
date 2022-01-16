import { Injectable } from '@nestjs/common';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { TransaccionEntity } from './entities/transaccion.entity';
import { EstadoTransaccionEnum } from './enums/Estado.Transaccion.enum';
import { TransaccionesEnum } from './enums/Transacciones.enum';
import TransaccionesMapper from './utils/mapper';
import { TransaccionRepository } from './utils/repository';

@Injectable()
export class TransaccionesService {

    constructor(
        private repository: TransaccionRepository,
        private mapper: TransaccionesMapper
    ) { }

    async crearInstalacion(cliente: ClienteEntity, cobrador: UsuarioEntity) {
        let instalacion = new TransaccionEntity();
        instalacion.cliente = cliente;
        instalacion.tipo_transaccion = TransaccionesEnum.CREACION_DE_CONTRATO;
        instalacion.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        instalacion.cobrador = cobrador;
        await this.repository.create(instalacion);

        let mensualidad = new TransaccionEntity();
        mensualidad.cliente = cliente;
        mensualidad.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        mensualidad.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        mensualidad.cobrador = cobrador;
        await this.repository.create(mensualidad);
    }

    async pagar(idtransaccion: number, cobrador: UsuarioEntity) {
        let trans = await this.repository.getById(idtransaccion);
        trans.cobrador = cobrador;
        trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        trans.fecha_pago = new Date();
        await this.repository.update(trans);
    }

    async createtrans(cliente: ClienteEntity,) {
        let trans = new TransaccionEntity();
        trans.cliente = cliente,
            trans.cobrador = null;
        trans.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
        trans.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        await this.repository.create(trans);
    }

    async getAllBystatus() {
        let data = await this.repository.getAllByStatus(EstadoTransaccionEnum.NO_PAGADO);
        return data.map((e) => this.mapper.transaccionCobroMapper(e));
    }

    async getTransaccionById(id:number):Promise<TransaccionEntity>{
        let data = await this.repository.getById(id);
        return data;
        }
    }



