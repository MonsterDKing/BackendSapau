import { Injectable } from "@nestjs/common";
import { ClientesService } from "src/clientes/clientes.service";
import { UsuarioService } from "src/usuarios/usuarios.service";
import { CreateTarifaDto } from "../dto/create-tarifa.dto";
import { UpdateTarifaDto } from "../dto/update-tarifa.dto";
import { TarifaEntity } from "../entities/tarifa.entity";





@Injectable()
export class TarifaMapper {

    // constructor(private clienteService: ClientesService,) { }

    async dtoToEntity(data: CreateTarifaDto): Promise<TarifaEntity> {

        // let us = await this.clienteService.findOneEntity(data.contratante);

        return new TarifaEntity(
            data.descripcion,
            data.costo,
            data.costoAnual,
            data.costoPagoAnticipado
        );
    }


    async dtoToEntityUpdate(data: UpdateTarifaDto): Promise<TarifaEntity> {
        return new TarifaEntity(
            data.descripcion,
            data.costo,
            data.costoAnual,
            data.costoPagoAnticipado,
            data.id
        );
    }


    entityToDto(data: TarifaEntity): UpdateTarifaDto {
        let d = new UpdateTarifaDto();
        d.costo = data.costo;
        d.descripcion = data.descripcion;
        d.costoAnual = data.costoAnual;
        d.costoPagoAnticipado = data.costoPagoAnticipado;
        d.id = data.id;
        return d;
    }

}