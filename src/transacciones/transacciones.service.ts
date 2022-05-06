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
import { ReadStream, readFileSync, createReadStream } from 'fs';
import { AjustarDeudaDto } from './dto/ajustarDeudaDto';
import { ClienteMapper } from 'src/clientes/utils/mapper';
import { TarifaRepository } from 'src/tarifa/utils/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRepository } from 'src/usuarios/utils/repository';
// IMPORTDATABASEK
import * as xlsx from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
import { getConnection, } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import BusquedaInterface from 'src/clientes/dto/busqueda.dto';
import { ColoniaRepository } from '../colonia/utils/colonia.repository';
import { EliminarAdeudo } from './dto/eliminarAdeudo.dto';
import HistorialPagoDto from './dto/historialPagoDto';
import { generarPagoPersonalizadoDto } from './dto/generarPagoPersonalizadoDto';
import { Transaccionestipo } from './enums/TipoDePago.enum';


@Injectable()
export class TransaccionesService {


    private readonly logger = new Logger(TransaccionesService.name);


    constructor(
        @InjectRepository(TransaccionEntity)
        private repositoryDB: Repository<TransaccionEntity>,
        private usuarioRepository: UsuarioRepository,
        private mapper: TransaccionesMapper,
        private clienteRepository: ClientesRepository,
        private cobroRepository: CobroRepository,
        private clienteMapper: ClienteMapper,
        private repository: TransaccionRepository,
        private tarifaRepository: TarifaRepository,
        private coloniaRepository: ColoniaRepository
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

    async eliminarAdeudos(data: EliminarAdeudo) {
        try {
            let cliente = await this.clienteRepository.getById(data.idCliente);
            await this.repository.deleteAllTransactionByClient(cliente);
            return true;
        } catch (ex) {
            console.log(ex);
            return false;
        }
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

    async newPayment(numMeses: number, idCliente: number, porcentaje: number, cobrador: UsuarioEntity, comentarios?: string) {


        let cliente = await this.clienteRepository.getById(idCliente);
        let trans = await this.repository.getAllMonthByIdClientLimitInvert(cliente);

        let transaccionesPagadas: TransaccionEntity[] = [];
        let total = 0;
        let valorDeDescuento = 0;
        let porcentajePorcentaje = 0;
        if (porcentaje != 0) {
            porcentajePorcentaje = porcentaje / 100;
        }

        for (let i = 0; i < numMeses; i++) {
            let tran = trans[i];
            valorDeDescuento = tran.monto * porcentajePorcentaje;
            total = tran.monto - valorDeDescuento;
            tran.monto = total;
            tran.descuento = porcentaje;
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
        cobroEntity.descuento = porcentaje;
        if (comentarios) {
            cobroEntity.comentarios = comentarios;
        }
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

    async getAllBystatus(options: IPaginationOptions, busqueda?: BusquedaInterface) {
        let d = await this.repository.getallTransactionsWithMonthQueryRaw(options, busqueda);
        return d;

    }

    async getTransaccionById(id: number): Promise<TransaccionEntity> {
        let data = await this.repository.getById(id);
        return data;
    }


    async pagoPorAdelantadoService(idCliente: number, tipoDePago: number, numeroDeMeses: number, us: UsuarioEntity) {
        try {
            let client = await this.clienteRepository.getByIdWithTransactions(idCliente);
            let trans = client?.transacciones;
            if (trans.length > 0) {
                trans.forEach((el) => {
                    if (el.estado_transaccion == EstadoTransaccionEnum.NO_PAGADO) {
                        return false;
                    }
                });
            }

            let now = new Date();
            let ultimaTransaccion = trans.length > 0 ? trans[trans.length - 1].fecha_creacion : new Date();
            let ultimaFecha = ultimaTransaccion
            let clienteFinal = client;
            //PAGO ANTICIPADO
            if (tipoDePago == 1) {
                let numDeMeses = numeroDeMeses;
                let arreglo: TransaccionEntity[] = [];
                for (var i = 0; i < numDeMeses; i++) {
                    ultimaFecha.setMonth(ultimaFecha.getMonth() + 1);
                    let newTransaction = new TransaccionEntity();
                    newTransaction.monto = client.tarifa.costoPagoAnticipado;
                    newTransaction.cobrador = us;
                    newTransaction.fecha_creacion = ultimaFecha;
                    newTransaction.fecha_pago = now;
                    newTransaction.cliente = clienteFinal;
                    newTransaction.estado_transaccion = EstadoTransaccionEnum.PAGADO;
                    newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
                    arreglo.push(newTransaction);
                }
                let cobro = new CobroEntity();
                cobro.cliente = clienteFinal;
                cobro.cobrador = us;
                cobro.fecha_creacion = new Date();
                cobro.folio = Math.floor(100000 + Math.random() * 900000).toString();
                cobro.transacciones = arreglo
                let d = await this.cobroRepository.create(cobro);

                return {
                    ok: true,
                    id: cobro.id
                };
            }
            //PAGO ANUAL
            else {
                let numDeMeses = 13;
                let arreglo: TransaccionEntity[] = [];
                for (var i = 0; i < numDeMeses; i++) {
                    ultimaFecha.setMonth(ultimaFecha.getMonth() + 1);
                    let newTransaction = new TransaccionEntity();
                    newTransaction.monto = client.tarifa.costoPagoAnticipado;
                    newTransaction.cobrador = us;
                    newTransaction.fecha_creacion = ultimaFecha;
                    newTransaction.fecha_pago = now;
                    newTransaction.cliente = clienteFinal;
                    newTransaction.estado_transaccion = EstadoTransaccionEnum.PAGADO;
                    newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
                    // let nt = await this.repository.create(newTransaction);
                    arreglo.push(newTransaction);
                }
                let cobro = new CobroEntity();
                cobro.cliente = clienteFinal;
                cobro.cobrador = us;
                cobro.fecha_creacion = new Date();
                cobro.folio = Math.floor(100000 + Math.random() * 900000).toString();
                cobro.transacciones = arreglo
                let d = await this.cobroRepository.create(cobro);

                for (let i of d.transacciones) {
                    d.cliente = clienteFinal;
                    d.cobrador = us;
                    await this.repository.update(i);
                }
                return {
                    ok: true,
                    id: cobro.id
                };
            }
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }



    async newGenerateTicket(id: number) {

        let pago = 0;
        let adeudo = 0;
        const root = join(__dirname, '../../assets/pdf/comprobante/comprobante.pug');
        const logoBase64 = await readFileSync(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });
        let cobro = await this.cobroRepository.getById(id);
        let pagoTotal = 0;
        let ticketModificado = false;
        let razon = '';
        let monto = 0;
        for (let i of cobro.transacciones) {
            pagoTotal += i.monto;
        }

        let transNoPagadas = await this.repository.getAllByClient(cobro.cliente, EstadoTransaccionEnum.NO_PAGADO);
        cobro.transacciones.forEach((el) => {
            pago += el.monto;
        })

        transNoPagadas.forEach((el) => {
            adeudo += el.cliente.tarifa.costo;
        })
        let total = pago;

        if (cobro.descuento != 0) {
            total = (pago * 100) / cobro.descuento;
        }

        if (cobro.transacciones.length == 1) {
            if (cobro.transacciones[0].tipo_transaccion == Transaccionestipo.PAGO_PERSONALIZADO) {
                ticketModificado = true;
                razon = cobro.transacciones[0].razon;
                monto = cobro.transacciones[0].monto;
            }
        }

        let fecha = new Date();
        let fechaParse = moment(fecha).locale('es-mx').format("L")
        const compiledFunction = pug.compileFile(root);
        const compiledContent = compiledFunction({
            logo: logoBase64,
            folio: cobro.folio,
            fecha: fechaParse,
            contrato: cobro.cliente.contrato,
            descuento: cobro.descuento,
            total: total,
            nombre: `${cobro.cliente.nombre} ${cobro.cliente.apellidoPaterno} ${cobro.cliente.apellidoMaterno}`,
            calle: cobro.cliente.calle,
            colonia: cobro.cliente.colonia.nombre,
            tarifa: cobro.cliente.tarifa.descripcion,
            adeudo: adeudo,
            pago: pagoTotal,
            pendiente: adeudo,
            comentarios: cobro.comentarios,
            ticketModificado: ticketModificado,
            razon: razon,
            monto: monto
        });
        let altura = "10.4in";
        // 50 palabras por reglon
        if (cobro.comentarios) {
            if (cobro.comentarios.length > 50) {
                altura = "10.8in"
            }
            if (cobro.comentarios.length > 100) {
                altura = "11.0in"
            }
            if (cobro.comentarios.length > 150) {
                altura = "11.4in"
            }

        }

        return pdf.create(compiledContent, {
            "height": altura,
            "width": "4.5in",
        })
    }


    //Servicios de carga

    async importToDatabase() {
        const file = join(__dirname, '../../assets/xls/file.xlsx');
        var readStream = createReadStream(join(__dirname, '../../assets/xls/file.xlsx'));

        try {


            const wb: WorkBook = await new Promise((resolve, reject) => {
                const stream: ReadStream = readStream;

                const buffers = [];

                stream.on('data', (data) => buffers.push(data));

                stream.on('end', () => {
                    const buffer = Buffer.concat(buffers);
                    resolve(xlsx.read(buffer, { type: 'buffer' }));
                });

                stream.on('error', (error) => reject(error));
            });

            const sheet: WorkSheet = wb.Sheets[wb.SheetNames[0]];
            const range = xlsx.utils.decode_range(sheet['!ref']);

            let usImportador = new UsuarioEntity(
                "Pedro Manuel Salas Galindo",
                "pedromanuelsalas@outlook.com",
                "123456",
                true,
            )

            try {
                let us = await this.usuarioRepository.create(usImportador);

                for (let R = range.s.r; R <= range.e.r; ++R) {
                    if (R === 0 || !sheet[xlsx.utils.encode_cell({ c: 0, r: R })]) {
                        continue;
                    }
                    let col = 0;

                    let id = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let contrato = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let tarifa = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let nombre = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let apellidoPaterno = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let apellidoMaterno = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let calle = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let colonia = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let deuda = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    const cp = "61940";
                    const localidad = "HUETAMO DE NUÑEZ";

                    let co = await this.coloniaRepository.getByNombre(colonia);
                    console.log(tarifa);
                    let tarifaEntity = await this.tarifaRepository.getById(tarifa);
                    console.log(tarifaEntity);

                    let cliente = new ClienteEntity(
                        contrato,
                        nombre,
                        apellidoMaterno,
                        apellidoPaterno,
                        us,
                        calle,
                        co,
                        cp,
                        localidad,
                        tarifaEntity
                    );
                    await this.clienteRepository.createclean(cliente);


                    if (deuda != 0) {
                        var date = new Date();
                        let numTransacciones = deuda / tarifaEntity.costo;
                        let numDeMeses = Math.ceil(numTransacciones);
                        for (var i = 0; i < numDeMeses; i++) {
                            let monthsminus = i;
                            date.setMonth(date.getMonth() - 1);
                            let newTransaction = new TransaccionEntity();
                            newTransaction.cliente = cliente;
                            newTransaction.monto = cliente.tarifa.costo;
                            newTransaction.cobrador = null;
                            newTransaction.fecha_creacion = date;
                            newTransaction.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
                            newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
                            await this.repositoryDB.save(newTransaction).catch((ex) => {
                                // console.log(ex);
                                console.log(date);
                                console.log(numDeMeses)
                            });
                        }
                    }
                }
                console.log("terminooooo de actualizar")
            } catch (ex) {
                console.log("Errrrooor")
                console.log(ex);
            }
        } catch (error) {
            this.logger.error('Erro en Excel');
            throw error;
        }
    }


    //Pagados y fecha para delante
    async importToDatabaseAdelantado() {
        console.log("si entro aca");
        // const file = join(__dirname, '../../assets/xls/adelantado.xlsx');
        var readStream = createReadStream(join(__dirname, '../../assets/xls/mayo.xlsx'));

        try {
            const wb: WorkBook = await new Promise((resolve, reject) => {
                const stream: ReadStream = readStream;

                const buffers = [];

                stream.on('data', (data) => buffers.push(data));

                stream.on('end', () => {
                    const buffer = Buffer.concat(buffers);
                    resolve(xlsx.read(buffer, { type: 'buffer' }));
                });

                stream.on('error', (error) => reject(error));
            });

            const sheet: WorkSheet = wb.Sheets[wb.SheetNames[0]];
            const range = xlsx.utils.decode_range(sheet['!ref']);

            let usImportador = new UsuarioEntity(
                "Pedro Manuel Salas Galindo",
                "pedromanuelsalas@outlook.com",
                "123456",
                true,
            )

            let posicion = 0;
            try {
                let us = await this.usuarioRepository.create(usImportador);
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    if (R === 0 || !sheet[xlsx.utils.encode_cell({ c: 0, r: R })]) {
                        continue;
                    }
                    console.log(posicion++);


                    let col = 0;
                    let id = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let contrato = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let tarifa = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let nombre = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let apellidoPaterno = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let apellidoMaterno = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                    let calle = null;
                    let colonia = null;
                    let deuda = 0;
                    const cp = "61940";
                    const localidad = "HUETAMO DE NUÑEZ";

                    console.log(contrato);
                    console.log(tarifa);
                    console.log(nombre);

                    let tarifaEntity = await this.tarifaRepository.getById(tarifa);

                    console.log("XXXXXX")
                    console.log(tarifaEntity)
                    console.log(tarifa)
                    let cliente = new ClienteEntity(
                        contrato,
                        nombre,
                        apellidoMaterno,
                        apellidoPaterno,
                        us,
                        calle,
                        colonia,
                        cp,
                        localidad,
                        tarifaEntity
                    );
                    await this.clienteRepository.createclean(cliente);
                    var date = new Date("Tuesday, 25 January 2022 1:00:00");
                    let numDeMeses = 4;
                    for (var i = 0; i < numDeMeses; i++) {
                        let newTransaction = new TransaccionEntity();
                        newTransaction.cliente = cliente;
                        newTransaction.monto = tarifaEntity.costo;
                        newTransaction.cobrador = null;
                        newTransaction.fecha_creacion = date;
                        newTransaction.fecha_pago = date;
                        newTransaction.estado_transaccion = EstadoTransaccionEnum.PAGADO;
                        newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
                        await this.repositoryDB.save(newTransaction).catch((ex) => {
                            console.log(cliente);
                            console.log(ex);
                            console.log(date);
                            console.log(numDeMeses)
                        });
                        date.setMonth(date.getMonth() + 1);
                    }
                }
                console.log("terminooooo de actualizar")
            } catch (ex) {
                console.log("Errrrooor")
                console.log(ex);
            }
        } catch (error) {
            this.logger.error('Erro en Excel');
            throw error;
        }
    }


    async historialPago(data: HistorialPagoDto) {
        let cliente = await this.repository.getHistorialDePago(data.idCliente);
        return cliente;
    }

    // <option value="1" selected>Reconexion $(350)</option>
    //     <option value="2" selected>Cambio de tubo $(680)</option>
    //     <option value="3" selected>Conexion al drenaje $(1000)</option>
    //     <option value="4" selected>Cambio de propietario $(350)</option>
    //     <option value="5" selected>Otros</option>
    async generarPagoPersonalizado(data: generarPagoPersonalizadoDto, us: UsuarioEntity) {
        console.log(us);
        let ce = await this.clienteRepository.getById(data.idCliente)
        let trans = new TransaccionEntity();
        let cobroEntity = new CobroEntity();
        let transpagadas: TransaccionEntity[] = [];

        if (data.accion == 1) {
            trans.cliente = ce;
            trans.cobrador = us;
            trans.descuento = 0;
            trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
            trans.fecha_creacion = new Date();
            trans.fecha_pago = new Date();
            trans.monto = 350;
            trans.tipo_transaccion = Transaccionestipo.PAGO_PERSONALIZADO
            trans.razon = "Reconexion";
        } else if (data.accion == 2) {
            trans.cliente = ce;
            trans.cobrador = us;
            trans.descuento = 0;
            trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
            trans.fecha_creacion = new Date();
            trans.fecha_pago = new Date();
            trans.monto = 680;
            trans.tipo_transaccion = Transaccionestipo.PAGO_PERSONALIZADO
            trans.razon = "Cambio de tubo";
        } else if (data.accion == 3) {
            trans.cliente = ce;
            trans.cobrador = us;
            trans.descuento = 0;
            trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
            trans.fecha_creacion = new Date();
            trans.fecha_pago = new Date();
            trans.monto = 350;
            trans.tipo_transaccion = Transaccionestipo.PAGO_PERSONALIZADO
            trans.razon = "Cambio del propietario";
        } else if (data.accion == 4) {
            trans.cliente = ce;
            trans.cobrador = us;
            trans.descuento = 0;
            trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
            trans.fecha_creacion = new Date();
            trans.fecha_pago = new Date();
            trans.monto = 680;
            trans.tipo_transaccion = Transaccionestipo.PAGO_PERSONALIZADO
            trans.razon = "Cambio de tubo";

        } else if (data.accion == 5) {
            trans.cliente = ce;
            trans.cobrador = us;
            trans.descuento = 0;
            trans.estado_transaccion = EstadoTransaccionEnum.PAGADO;
            trans.fecha_creacion = new Date();
            trans.fecha_pago = new Date();
            trans.monto = data.monto;
            trans.tipo_transaccion = Transaccionestipo.PAGO_PERSONALIZADO
            trans.razon = data.razon;
        }
        transpagadas.push(trans);
        //se crea el cobro despues de todo 
        cobroEntity.cliente = ce;
        cobroEntity.cobrador = us;
        cobroEntity.fecha_creacion = new Date();
        cobroEntity.transacciones = transpagadas;
        cobroEntity.folio = Math.floor(100000 + Math.random() * 900000).toString();
        cobroEntity.descuento = 0;
        let cobro = await this.cobroRepository.create(cobroEntity)
        return cobro;
    }

}



