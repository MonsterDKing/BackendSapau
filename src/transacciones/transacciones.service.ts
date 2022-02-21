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
import * as xlsx from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioRepository } from '../usuarios/utils/repository';
import { TarifaRepository } from 'src/tarifa/utils/repository';

@Injectable()
export class TransaccionesService {

    private readonly logger = new Logger(TransaccionesService.name);


    constructor(
        @InjectRepository(TransaccionEntity)
        private repositoryDB: Repository<TransaccionEntity>,
        private tarifaRepository:TarifaRepository,
        private usuarioRepository:UsuarioRepository,
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
        trans.monto = cliente.tarifa.costo;
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

           try{
            let us =  await this.usuarioRepository.create(usImportador);

            for (let R = range.s.r; R <= range.e.r; ++R) {
                if (R === 0 || !sheet[xlsx.utils.encode_cell({ c: 0, r: R })]) {
                    continue;
                }
                let col = 0;

                let id = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let contrato = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let tarifa = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let descripcion = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let apellidoPaterno = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let apellidoMaterno = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let nombre = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let calle = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let colonia = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let cp = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let localidad = sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v;
                let deuda = Number(sheet[xlsx.utils.encode_cell({ c: col++, r: R })]?.v);

                
                let tarifaEntity = await this.tarifaRepository.getById(tarifa);
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


                if(deuda != 0){
                    var date = new Date();
                    let numTransacciones = deuda/tarifaEntity.costo;
                    let numDeMeses = Math.ceil(numTransacciones);
                    for(var i = 0;i<numDeMeses;i++){
                        date.setMonth(date.getMonth() - 1);
                        let newTransaction = new TransaccionEntity();
                        newTransaction.cliente = cliente;
                        newTransaction.monto = cliente.tarifa.costo;
                        newTransaction.cobrador = null;
                        newTransaction.fecha_creacion = date;
                        newTransaction.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
                        newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
                        await this.repositoryDB.save(newTransaction).catch((ex)=>{
                            // console.log(ex);
                            console.log(date);
                            console.log(numDeMeses)
                        });
                    }
                }
            }
            console.log("terminooooo de actualizar")
            }catch(ex){
               console.log("Errrrooor")
               console.log(ex);
           }
        } catch (error) {
            this.logger.error('Erro en Excel');
            throw error;
        }
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



