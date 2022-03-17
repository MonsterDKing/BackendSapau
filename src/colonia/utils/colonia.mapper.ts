import { Injectable } from "@nestjs/common";
import { ClientesService } from "src/clientes/clientes.service";
import { UsuarioService } from "src/usuarios/usuarios.service";
import { CreateColoniaDto } from '../dto/create-colonia.dto';
import { ColoniaEntity } from '../entities/colonia.entity';
import { UpdateColoniaDto } from '../dto/update-colonia.dto';
import { TarifaEntity } from '../../tarifa/entities/tarifa.entity';




@Injectable()
export class ColoniaMapper {


     dtoToEntity(data: CreateColoniaDto): ColoniaEntity {
        return new ColoniaEntity(
            data.nombre
        );
    }


     dtoToEntityUpdate(data: UpdateColoniaDto): ColoniaEntity {
        return new ColoniaEntity(
            data.nombre,
            data.id
        );
    }


    entityToDto(data: ColoniaEntity): UpdateColoniaDto {
        let update = new UpdateColoniaDto();
        update.id = data.id;
        update.nombre = data.nombre;
        return update;

    }

}