import { Injectable } from "@nestjs/common";
import { TransferCobroDto } from "../dto/transfer.cobro.dto";
import { CobroEntity } from "../entities/cobro.entity";


@Injectable()
export class CobroMapper {

    entityToDto(data: CobroEntity): TransferCobroDto {
        let monto = 0;
        data.transacciones.forEach((el) => {
            monto += el.monto;
        })
        return new TransferCobroDto(
            `${data.cliente.nombre} ${data.cliente.apellidoPaterno} ${data.cliente.apellidoMaterno}`,
            `${data.cobrador.nombre}`,
            data.fecha_creacion,
            monto,
            data.folio
        );
    }


}