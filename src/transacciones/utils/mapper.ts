import {  Injectable } from "@nestjs/common";
import TransaccionCobroDto from "../dto/TransaccionCobro.dto";
import { TransaccionEntity } from "../entities/transaccion.entity";

@Injectable()
export default class TransaccionesMapper{


    constructor(){}

    transaccionCobroMapper(trans:TransaccionEntity):TransaccionCobroDto{
        return new TransaccionCobroDto(
            trans.id,
            trans.cliente.nombre,
            trans.cliente.apellidoMaterno,
            trans.cliente.apellidoPaterno,
            trans.fecha_creacion,
            trans.fecha_pago,
            trans.estado_transaccion
        )
    }

}