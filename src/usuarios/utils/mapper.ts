import { Injectable } from "@nestjs/common";
import { y } from "pdfkit";
import { CreateUsuarioDto } from "../dto/create-usuario.dto";
import { UpdateUsuarioDto } from "../dto/update-usuario.dto";
import { UsuarioTransferDto } from "../dto/usuario-transfer.dto";
import { UsuarioEntity } from "../entities/usuario.entity";




@Injectable()
export class UsuarioMapper {

    dtoToEntity(data: CreateUsuarioDto): UsuarioEntity {
        return new UsuarioEntity(
            data.nombre,
            data.email,
            data.password,
            data.activo
        );
    }

    dtoToEntityUpdate(data: UpdateUsuarioDto): UsuarioEntity {
        return new UsuarioEntity(
            data.nombre,
            data.email,
            data.password,
            data.activo,
            data.id
        );
    }

    entityToTransfer(data: UsuarioEntity): UsuarioTransferDto {
        let u = new UsuarioTransferDto();
        u.id = data.id;
        u.activo = data.activo;
        u.email = data.email;
        u.nombre = data.nombre;
        u.rol = data.rol;
        return u;
    }

    entityToDto(data: UsuarioEntity): CreateUsuarioDto {
        return new CreateUsuarioDto(
            data.nombre,
            data.email,
            data.password,
            data.activo,
            data.rol
        );
    }

}