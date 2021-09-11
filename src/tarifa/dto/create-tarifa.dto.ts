import { ApiProperty } from "@nestjs/swagger";

export class CreateTarifaDto {


    @ApiProperty()
    descripcion: string;
    @ApiProperty()
    costo: number;

    constructor(descripcion:string,costo:number){
        this.descripcion = descripcion;
        this.costo = costo;

    }
}
