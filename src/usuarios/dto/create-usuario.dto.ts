import { ApiProperty } from "@nestjs/swagger";

export class CreateUsuarioDto {

    @ApiProperty()
     nombre: string;
     @ApiProperty()
     email: string;
     @ApiProperty()
     password: string;
     @ApiProperty()
     activo: boolean;

     constructor( nombre: string, email: string,password:string,activo:boolean) {
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.activo = activo;
    }

}
