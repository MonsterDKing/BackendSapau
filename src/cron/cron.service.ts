import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientesRepository } from 'src/clientes/utils/repository';
import { TransaccionEntity } from 'src/transacciones/entities/transaccion.entity';
import { EstadoTransaccionEnum } from 'src/transacciones/enums/Estado.Transaccion.enum';
import { TransaccionesEnum } from 'src/transacciones/enums/Transacciones.enum';
import { TransaccionRepository } from 'src/transacciones/utils/repository';

@Injectable()
export class CronService {

    constructor(
        private clientes: ClientesRepository,
        private transaccion: TransaccionRepository
    ) { }


    // @Cron(CronExpression.EVERY_10_SECONDS)
    async runEveryMinute() {
        let now = new Date();
        //obtengo a todo los usuarios
        let clients = await this.clientes.getAll();
        let id = clients[0];
        //despues obtengo cuando fue la ultima fecha de pago del usuario
        let ultimaTransaccion = await this.transaccion.getUltimaTransaccionPorUsuario(2365)
        // existen dos casos posibles que si haya realizado un pago al menos y otro que nunca lo haya hecho 
        //en caso de que si 
        if (ultimaTransaccion) {
            //pregunto si la fecha de la ultima transaccion es menor a la fecha de ahora
            if (ultimaTransaccion.fecha_creacion < now) {
                let difMonth: number = this.monthDiff(now, ultimaTransaccion.fecha_creacion);
                //si la diferencia es 0 significa que ya esta todo al corriente en caso contrario 
                if (difMonth > 0) {
                    let nowRestart = new Date();
                    for (let i = 0; i < difMonth; i++) {
                        let d = i + 1;
                        console.log(" antes ")
                        console.log(nowRestart);
                        nowRestart.setMonth(nowRestart.getMonth() - d);
                        console.log(" despues ")
                        console.log(nowRestart)
                        this.generateNewTransactions(ultimaTransaccion, nowRestart);
                    }
                }
            }
        }
        // en caso de que no 
        else {
            let ultimaTransaccionRegistrada = await this.transaccion.getUltimaTransaccionRegistradaSinPagar(id.id);
            let difMonth: number = this.monthDiff(now, ultimaTransaccionRegistrada.fecha_creacion);
            //si la diferencia es 0 significa que ya esta todo al corriente en caso contrario 
            if (difMonth > 0) {
                let nowRestart = new Date();
                for (let i = 0; i < difMonth; i++) {
                    let d = i + 1;
                    console.log(" antes ")
                    console.log(nowRestart);
                    nowRestart.setMonth(nowRestart.getMonth() - d);
                    console.log(" despues ")
                    console.log(nowRestart)
                    this.generateNewTransactions(ultimaTransaccionRegistrada, nowRestart);
                }
            }
        }

    }

    generateNewTransactions(tran: TransaccionEntity, date: Date) {
        let newTransaction = new TransaccionEntity();
        newTransaction.cliente = tran.cliente;
        newTransaction.cobro = tran.cobro;
        newTransaction.estado_transaccion = EstadoTransaccionEnum.NO_PAGADO;
        newTransaction.monto = tran.monto;
        newTransaction.cobrador = null;
        newTransaction.fecha_creacion = date;
        newTransaction.tipo_transaccion = TransaccionesEnum.PAGO_DE_MENSUALIDAD;
        console.log(newTransaction)
        // this.transaccion.create(newTransaction);
    }

    monthDiff(d1: Date, d2: Date) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }



}
