import { Injectable } from "@nestjs/common";
import { TarifaRepository } from "src/tarifa/utils/repository";
import { UsuarioService } from "src/usuarios/usuarios.service";
import { CreateClienteDto } from "../dto/create-cliente.dto";
import { UpdateClienteDto } from "../dto/update-cliente.dto";
import { ClienteEntity } from "../entities/cliente.entity";
import { SendClientDto } from '../dto/SendClientDto';
import { EstadoTransaccionEnum } from '../../transacciones/enums/Estado.Transaccion.enum';




@Injectable()
export class ClienteMapper {

    constructor(private service: UsuarioService, private tarifaService: TarifaRepository) { }

    async dtoToEntity(data: CreateClienteDto): Promise<ClienteEntity> {

        let us = await this.service.findOneEntity(data.contratante);
        let tarifa = await this.tarifaService.getById(data.tarifa);

        return new ClienteEntity(
            data.contrato,
            data.nombre,
            data.apellidoMaterno,
            data.apellidoPaterno,
            us,
            data.calle,
            data.colonia,
            data.codigoPostal,
            data.localidad,
            tarifa
        );
    }

    async dtoToEntityUpdate(data: UpdateClienteDto): Promise<ClienteEntity> {
        let us = await this.service.findOneEntity(data.contratante);
        let tarifa = await this.tarifaService.getById(data.tarifa);
        return new ClienteEntity(
            data.contrato,
            data.nombre,
            data.apellidoMaterno,
            data.apellidoPaterno,
            us,
            data.calle,
            data.colonia,
            data.codigoPostal,
            data.localidad,
            tarifa,
            data.id
        );
    }

    // entityToTransfer(data: UsuarioEntity): UsuarioTransferDto {
    //     let u = new UsuarioTransferDto();
    //     u.id = data.id;
    //     u.activo = data.activo;
    //     u.email = data.email;
    //     u.nombre = data.nombre;
    //     return u;
    // }

    entityToDto(data: ClienteEntity): CreateClienteDto {
        try {
            return new CreateClienteDto(
                data.contrato,
                data.nombre,
                data.apellidoPaterno,
                data.apellidoMaterno,
                data.contratante.id,
                data.calle,
                data.colonia,
                data.codigoPostal,
                data.localidad,
                data.tarifa.id,
                data?.id != null ? data.id : undefined
            );
        } catch (ex) {
            console.log(data);
        }
    }
    
    entityToSendClientDto(data:ClienteEntity):SendClientDto{
        try {
            let ultimaFecha:Date|undefined;

            if(data.transacciones){
                data.transacciones.forEach((el)=>{
                    if(el.estado_transaccion == EstadoTransaccionEnum.PAGADO){
                        ultimaFecha = el.fecha_pago;
                    }
                })
            }

            return new SendClientDto(
                data.id,
                data.contrato,
                data.nombre,
                data.apellidoMaterno,
                data.apellidoPaterno,
                data.contratante.id,
                data.calle,
                data.colonia,
                data.codigoPostal,
                data.localidad,
                data.tarifa.costo,
                ultimaFecha 
            );
        } catch (ex) {
            console.log(data);
        }
    }

    

}