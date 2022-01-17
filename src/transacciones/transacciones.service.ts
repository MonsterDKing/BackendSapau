import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { join } from 'path';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { TransaccionEntity } from './entities/transaccion.entity';
import { EstadoTransaccionEnum } from './enums/Estado.Transaccion.enum';
import { TransaccionesEnum } from './enums/Transacciones.enum';
import TransaccionesMapper from './utils/mapper';
import { TransaccionRepository } from './utils/repository';
import * as pug from 'pug';
import * as pdf from 'html-pdf'
const fs = require('fs').promises;

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
        instalacion.folio =  Math.floor(100000 + Math.random() * 900000).toString();
        instalacion.fecha_pago = new Date();
        instalacion.cobrador = cobrador;
        await this.repository.create(instalacion);

        let mensualidad = new TransaccionEntity();
        mensualidad.cliente = cliente;
        mensualidad.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        mensualidad.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        mensualidad.folio =  Math.floor(100000 + Math.random() * 900000).toString();
        mensualidad.fecha_pago = new Date();
        mensualidad.cobrador = cobrador;
        await this.repository.create(mensualidad);
    }

    async pagar(idtransaccion: number, cobrador: UsuarioEntity) {
        let trans = await this.repository.getById(idtransaccion);
        trans.cobrador = cobrador;
        trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        trans.folio = Math.floor(100000 + Math.random() * 900000).toString();
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

    async getTransaccionById(id: number): Promise<TransaccionEntity> {
        let data = await this.repository.getById(id);
        return data;
    }


    async generateTicket(id: number) {
        const root = join(__dirname, '../../assets/pdf/comprobante/comprobante.pug');
        const logoBase64 = await fs.readFile(join(__dirname, '../../assets/pdf/logo.png'), {encoding: 'base64'});

        let trans = await this.getTransaccionById(id);
        let fecha = new Date();
        let fechaParse = moment(fecha).locale('es-mx').format("L")
        const compiledFunction = pug.compileFile(root);
        const compiledContent = compiledFunction({
            logo:logoBase64,
            folio: trans.folio,
            fecha: fechaParse,
            contrato: trans.cliente.contrato,
            nombre: `${trans.cliente.nombre} ${trans.cliente.apellidoPaterno} ${trans.cliente.apellidoPaterno}`,
            calle: trans.cliente.calle,
            colonia: trans.cliente.colonia,
            tarifa: trans.cliente.tarifa.costo,
            adeudo: "0",
            pago:  trans.cliente.tarifa.costo,
            pendiente: 0
        });
        return pdf.create(compiledContent)
    }
}



