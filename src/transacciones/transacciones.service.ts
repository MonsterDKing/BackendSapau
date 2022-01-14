import { Injectable } from '@nestjs/common';
import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { TransaccionEntity } from './entities/transaccion.entity';
import { TransaccionRepository } from './utils/repository';

@Injectable()
export class TransaccionesService {

    constructor(
        private repository:TransaccionRepository,
    ){}

    async create(tipo_transaccion:number,cliente:ClienteEntity){
        let data = new TransaccionEntity();
        data.cliente = cliente;
        data.tipo_transaccion = tipo_transaccion;
        await this.repository.create(data);
    }

}
