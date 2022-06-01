import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { ClientesRepository } from 'src/clientes/utils/repository';
import { TransaccionEntity } from 'src/transacciones/entities/transaccion.entity';
import { EstadoTransaccionEnum } from 'src/transacciones/enums/Estado.Transaccion.enum';
import { TransaccionesEnum } from 'src/transacciones/enums/Transacciones.enum';
import { TransaccionRepository } from 'src/transacciones/utils/repository';
import * as moment from 'moment';

@Injectable()
export class CronService {

    constructor(
        private clientes: ClientesRepository,
        private transaccion: TransaccionRepository
    ) { }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    async scriptPersonalizado() {
        try {
            let firstday = new Date();
            let lastDay = new Date(firstday.getFullYear(), firstday.getMonth() + 1, 0);

            let formattedDate = (moment(firstday)).format('YYYY-MM-DD')
            let formattedDatetwo = (moment(lastDay)).format('YYYY-MM-DD')

            console.log(formattedDate)
            console.log(formattedDatetwo)

            let todoLosClientes = await this.clientes.getAll();
            let clientesConTransaccionesDeEseMes = await this.clientes.getClientesConTransaccionesDelMes(formattedDate, formattedDatetwo);
            let listaLimpia = todoLosClientes.filter((el) => !clientesConTransaccionesDeEseMes.some(o2 => el.id === o2.id))
            for (let c of listaLimpia) {
                await this.generarTransaccionDecobro(c);
            }
            return "termino";
        } catch (ex) {
            return ex;
        }
    }



    //metodo exclusivo para generar deuda
    async generarTransaccionDecobro(client: ClienteEntity) {
        let newTransaction = new TransaccionEntity();
        newTransaction.cliente = client;
        newTransaction.monto = client.tarifa.costo;
        newTransaction.cobrador = null;
        newTransaction.fecha_creacion = new Date(2022, 2, 1);
        newTransaction.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
        newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        this.transaccion.create(newTransaction);
    }


}
