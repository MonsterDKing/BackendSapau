import { Injectable, Logger } from '@nestjs/common';
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
import { readFileSync } from 'fs';
import { AjustarDeudaDto } from './dto/ajustarDeudaDto';
import { ClienteMapper } from 'src/clientes/utils/mapper';
import { TarifaRepository } from 'src/tarifa/utils/repository';
@Injectable()
export class TransaccionesService {

    private readonly logger = new Logger(TransaccionesService.name);


    constructor(
        private clienteRepository: ClientesRepository,
        private cobroRepository: CobroRepository,
        private clienteMapper: ClienteMapper,
        private repository: TransaccionRepository,
        private tarifaRepository: TarifaRepository
    ) { }

    async crearInstalacion(cliente: ClienteEntity, cobrador: UsuarioEntity) {
        let instalacion = new TransaccionEntity();
        instalacion.cliente = cliente;
        instalacion.tipo_transaccion = TransaccionesEnum.CREACION_DE_CONTRATO;
        instalacion.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        instalacion.fecha_pago = new Date();
        instalacion.cobrador = cobrador;
        instalacion.monto = 1200;
        await this.repository.create(instalacion);

        let mensualidad = new TransaccionEntity();
        mensualidad.cliente = cliente;
        mensualidad.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        mensualidad.estado_transaccion = EstadoTransaccionEnum.PAGADO;
        mensualidad.fecha_pago = new Date();
        mensualidad.cobrador = cobrador;
        mensualidad.monto = cliente.tarifa.costo;
        await this.repository.create(mensualidad);
    }



    async reajustar(data: AjustarDeudaDto) {

        let cliente = await this.clienteMapper.dtoToEntityUpdate(data);
        let nuevoTipoDeTarifa = await this.tarifaRepository.getById(data.tipoDeTarifa);
        cliente.tarifa = nuevoTipoDeTarifa;
        await this.repository.deleteAllTransactionByClient(cliente)

        var date = new Date();
        let numTransacciones = data.numeroDeMeses;
        for (var i = 0; i < numTransacciones; i++) {
            let newTransaction = new TransaccionEntity();
            newTransaction.cliente = cliente;
            newTransaction.monto = cliente.tarifa.costo;
            newTransaction.cobrador = null;
            newTransaction.fecha_creacion = date;
            newTransaction.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
            newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
            await this.repository.create(newTransaction);
            date.setMonth(date.getMonth() - 1);
        }
        return true;
    }

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
        trans.monto = cliente.tarifa.costo;
        trans.cobrador = null;
        trans.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
        trans.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        await this.repository.create(trans);
    }

    async getAllBystatus() {
        let d = await this.repository.getallTransactionsWithMonthQueryRaw();
        return d;
    }

    async getTransaccionById(id: number): Promise<TransaccionEntity> {
        let data = await this.repository.getById(id);
        return data;
    }


    async newGenerateTicket(id: number) {

        let pago = 0;
        let adeudo = 0;
        const root = join(__dirname, '../../assets/pdf/comprobante/comprobante.pug');
        const logoBase64 = await readFileSync(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });

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
            nombre: `${cobro.cliente.nombre} ${cobro.cliente.apellidoPaterno} ${cobro.cliente.apellidoMaterno}`,
            calle: cobro.cliente.calle,
            colonia: cobro.cliente.colonia,
            tarifa: cobro.cliente.tarifa.descripcion,
            adeudo: adeudo + pago,
            pago: pago,
            pendiente: adeudo
        });
        return pdf.create(compiledContent)
    }

}



