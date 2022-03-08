import { ApiProperty } from "@nestjs/swagger";

export class CreateTarifaDto {


    @ApiProperty()
    descripcion: string;
    @ApiProperty()
    costo: number;
    @ApiProperty()
    costoAnual:number;
    @ApiProperty()
    costoPagoAnticipado:number;


}
