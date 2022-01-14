import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CobroRepository } from 'src/cobros/utils/repository';

@Injectable()
export class CronService {

    constructor(
        private _cobroRepository:CobroRepository
    ){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    runEveryMinute() {
     console.log('todo los dias a las 12 del medio dia y a la media noche');
    }

}
