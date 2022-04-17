import { Injectable } from '@nestjs/common';
import { TransaccionRepository } from 'src/transacciones/utils/repository';
import { ClientesRepository } from '../clientes/utils/repository';
import { DashboardDto } from './dto/dashboard.dto';
import { UsuarioRepository } from '../usuarios/utils/repository';
import { mesesUtils } from './utils/meses';
import { ColoniaRepository } from '../colonia/utils/colonia.repository';
import FiltradoDashboardDto from './dto/filtrado.dto';
import { TransaccionesEnum } from 'src/transacciones/enums/Transacciones.enum';
import { EstadoTransaccionEnum } from 'src/transacciones/enums/Estado.Transaccion.enum';
import { read, write, utils, writeFile } from 'xlsx'
import { v4 as uuidv4 } from 'uuid';
import { FiltradoXlsDashboardDto } from './dto/dashboard.xls.dto';
import { join } from 'path';

@Injectable()
export class DashboardService {

    constructor(
        private clientesRepository: ClientesRepository,
        private transaccionRepository: TransaccionRepository,
        private usuarioRepository: UsuarioRepository,
        private coloniaRepository: ColoniaRepository

    ) { }

    async getDashboard() {
        let dashboard = new DashboardDto();
        let m = mesesUtils;
        let data: any[] = [];
        for (let i of m) {
            let valor = await this.transaccionRepository.getAllMonthDashboard(i.inicio, i.fin);
            data.push({
                mese: i.nombre,
                valor: valor[0].valor
            })
        }
        dashboard.meses = data;
        return dashboard;
    }

    async getUsuariosTotales(filtro: FiltradoDashboardDto) {
        let c = await this.clientesRepository.getAllDashboard(filtro);
        return c.length;
    }

    async getUltimasTransacciones(filtro: FiltradoDashboardDto) {
        let trans = await this.transaccionRepository.getUltimasTransacciones(filtro);
        let data: any[] = [];
        for (let i of trans) {
            data.push({
                nombre: `${i.cliente.nombre} ${i.cliente.apellidoPaterno} ${i.cliente.apellidoMaterno}`,
                estado: EstadoTransaccionEnum[i.estado_transaccion],
                tipo: TransaccionesEnum[i.tipo_transaccion],
                fechaDeCreacion: i.fecha_creacion,
                fechaDePago: i.fecha_pago,
                cobrador: `${i.cobrador.nombre}`,
            })
        }
        return data;
    }

    async ingresosPorCobradores(filtro: FiltradoDashboardDto) {
        let cobradoresConTotal = await this.usuarioRepository.getCobradoresConMonto(filtro);
        return cobradoresConTotal;
    }

    async getTransacciones(filtro: FiltradoDashboardDto) {
        let cobradoresConTotal = await this.usuarioRepository.getCobradoresConMonto(filtro);
        return cobradoresConTotal;
    }

    async getDeudaTotal(filtro: FiltradoDashboardDto) {
        let deudaRaw = await this.transaccionRepository.getAllDeuda(filtro);
        return Number(deudaRaw.deuda);
    }

    async getMontosPorColonia(filtro: FiltradoDashboardDto) {
        let colonias = await this.coloniaRepository.getAll();
        let coloniasMonto: any[] = [];
        for (let i of colonias) {
            let valor = await this.coloniaRepository.getMontoByColnias(i.id, filtro);
            let monto = valor.valor ? Number(valor.valor) : 0
            coloniasMonto.push({
                nombre: i.nombre,
                valor: monto
            })
        }
        return coloniasMonto;
    }


    async generarXlsTranssaciones(filtro: FiltradoXlsDashboardDto) {
        const root = join(__dirname, '../../assets/report/');

        let trans = await this.transaccionRepository.getAllTransaccionesDashboardXls(filtro);
        let data: any[] = [];
        for (let i of trans) {
            data.push({
                cobrador: i.cobrador.nombre,
                nombre: i.cliente.nombre,
                apellidoPaterno: i.cliente.apellidoPaterno,
                apellidoMaterno: i.cliente.apellidoMaterno,
                calleYnumero: i.cliente.calle ? `${i.cliente.calle}` : "",
                colonia: i.cliente.colonia ? i.cliente.colonia.nombre : "",
                pago: `$ ${i.monto}`,
                fechaDeCreacion: i.fecha_creacion,
                fechaDePago: i.fecha_pago
            })
        }

        /* generate worksheet and workbook */
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Transsaciones");
        utils.sheet_add_aoa(worksheet,
            [["Cobrador",
                "Nombre",
                "Apellido Paterno",
                "Apellido Materno",
                "Calle y Numero",
                "Colonia",
                "Monto",
                "Fecha de Creacion",
                "Fecha de pago"]], { origin: "A1" });



        let nombre = uuidv4()
        let file = `${root}${nombre}.xlsx`;

        /* create an XLSX file and try to save to Presidents.xlsx */
        writeFile(workbook, file);
        return file;
    }



}
