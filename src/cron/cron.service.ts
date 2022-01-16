import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransaccionesService } from 'src/transacciones/transacciones.service';
import { TransaccionRepository } from 'src/transacciones/utils/repository';

@Injectable()
export class CronService {

    constructor(private transaccionesRepository:TransaccionRepository,private transaccionesService:TransaccionesService){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async runEveryMinute() {
     console.log('todo los dias a las 12 del medio dia y a la media noche');
     let obtenerTransacciones = await this.transaccionesRepository.getAlltranssactionsTypeMensualidadVencidas();
     for(let trans of obtenerTransacciones){
        await this.transaccionesService.createtrans(trans.cliente);
     }
    }

}
