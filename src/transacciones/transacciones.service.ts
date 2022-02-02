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
import { ClientesRepository } from 'src/clientes/utils/repository';
import { CobroEntity } from 'src/cobros/entities/cobro.entity';
import { CobroRepository } from 'src/cobros/utils/repository';
const fs = require('fs').promises;

@Injectable()
export class TransaccionesService {

    constructor(
        private clienteRepository: ClientesRepository,
        private cobroRepository: CobroRepository,
        private repository: TransaccionRepository,
        private mapper: TransaccionesMapper
    ) { }

    async crearInstalacion(cliente: ClienteEntity, cobrador: UsuarioEntity) {
        let instalacion = new TransaccionEntity();
        instalacion.cliente = cliente;
        instalacion.tipo_transaccion = TransaccionesEnum.CREACION_DE_CONTRATO;
        instalacion.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        instalacion.fecha_pago = new Date();
        instalacion.cobrador = cobrador;
        await this.repository.create(instalacion);

        let mensualidad = new TransaccionEntity();
        mensualidad.cliente = cliente;
        mensualidad.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        mensualidad.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        mensualidad.fecha_pago = new Date();
        mensualidad.cobrador = cobrador;
        await this.repository.create(mensualidad);
    }

    // // async pagar(idtransaccion: number, cobrador: UsuarioEntity) {
    // //     let trans = await this.repository.getById(idtransaccion);
    // //     trans.cobrador = cobrador;
    // //     trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
    // //     trans.folio = Math.floor(100000 + Math.random() * 900000).toString();
    // //     trans.fecha_pago = new Date();
    // //     await this.repository.update(trans);
    // // }

    async newPayment(numMeses: number, idCliente: number, cobrador: UsuarioEntity) {
        let cliente = await this.clienteRepository.getById(idCliente);
        let trans = await this.repository.getAllMonthByIdClientLimit(cliente);
        let transaccionesPagadas: TransaccionEntity[] = [];
        for (let i = 0; i < numMeses; i++) {
            let tran = trans[i];
            tran.cobrador = cobrador;
            tran.estado_transaccion = EstadoTransaccionEnum.PAGADO;
            tran.fecha_pago = new Date();
            await this.repository.update(tran);
            transaccionesPagadas.push(tran);
        }

        let cobroEntity = new CobroEntity();
        cobroEntity.cliente = cliente;
        cobroEntity.cobrador = cobrador;
        cobroEntity.fecha_creacion = new Date();
        cobroEntity.transacciones = transaccionesPagadas;
        cobroEntity.folio = Math.floor(100000 + Math.random() * 900000).toString();
        let cobro = await this.cobroRepository.create(cobroEntity);
        return cobro;
    }

    async createtrans(cliente: ClienteEntity,) {
        let trans = new TransaccionEntity();
        trans.cliente = cliente;
        trans.cobrador = null;
        trans.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
        trans.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        await this.repository.create(trans);
    }

    async getAllBystatus() {
        let d = await this.repository.getallTransactionsWithMonthQueryRaw();
        return d;
        let data = await this.repository.getAllByStatus(EstadoTransaccionEnum.NO_PAGADO);
        return data.map((e) => this.mapper.transaccionCobroMapper(e));
    }

    async getTransaccionById(id: number): Promise<TransaccionEntity> {
        let data = await this.repository.getById(id);
        return data;
    }


    async newGenerateTicket(id: number) {

        let pago = 0;
        let adeudo = 0;
        const root = join(__dirname, '../../assets/pdf/comprobante/comprobante.pug');
        const logoBase64 = await fs.readFile(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });

        let cobro = await this.cobroRepository.getById(id);
        let transNoPagadas = await this.repository.getAllByClient(cobro.cliente, EstadoTransaccionEnum.NO_PAGADO);





        cobro.transacciones.forEach((el) => {
            pago += el.cliente.tarifa.costo;
        })

        transNoPagadas.forEach((el) => {
            adeudo += el.cliente.tarifa.costo;
        })




        let fecha = new Date();
        let fechaParse = moment(fecha).locale('es-mx').format("L")
        const compiledFunction = pug.compileFile(root);
        const compiledContent = compiledFunction({
            logo: logoBase64,
            folio: cobro.folio,
            fecha: fechaParse,
            contrato: cobro.cliente.contrato,
            nombre: `${cobro.cliente.nombre} ${cobro.cliente.apellidoPaterno} ${cobro.cliente.apellidoPaterno}`,
            calle: cobro.cliente.calle,
            colonia: cobro.cliente.colonia,
            tarifa: cobro.cliente.tarifa.descripcion,
            adeudo: adeudo + pago,
            pago: pago,
            pendiente: adeudo
        });
        return pdf.create(compiledContent)
    }


    // // async generateTicket(id: number) {
    // //     const root = join(__dirname, '../../assets/pdf/comprobante/comprobante.pug');
    // //     const logoBase64 = await fs.readFile(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });

    // //     let trans = await this.getTransaccionById(id);
    // //     let fecha = new Date();
    // //     let fechaParse = moment(fecha).locale('es-mx').format("L")
    // //     const compiledFunction = pug.compileFile(root);
    // //     const compiledContent = compiledFunction({
    // //         logo: logoBase64,
    // //         folio: trans.folio,
    // //         fecha: fechaParse,
    // //         contrato: trans.cliente.contrato,
    // //         nombre: `${trans.cliente.nombre} ${trans.cliente.apellidoPaterno} ${trans.cliente.apellidoPaterno}`,
    // //         calle: trans.cliente.calle,
    // //         colonia: trans.cliente.colonia,
    // //         tarifa: trans.cliente.tarifa.costo,
    // //         adeudo: "0",
    // //         pago: trans.cliente.tarifa.costo,
    // //         pendiente: 0
    // //     });
    // //     return pdf.create(compiledContent)
    // // }
}



