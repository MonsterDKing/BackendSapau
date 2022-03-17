import { ApiProperty } from "@nestjs/swagger";

export class AjustarDeudaDto {

    @ApiProperty()
    id: number;
    @ApiProperty()
    contrato: string;
    @ApiProperty()
    nombre: string;
    @ApiProperty()
    apellidoMaterno: string;
    @ApiProperty()
    apellidoPaterno: string;
    @ApiProperty()
    calle: string;
    @ApiProperty()
    colonia: number;
    @ApiProperty()
    codigoPostal: string;
    @ApiProperty()
    localidad: string;
    @ApiProperty()
    tarifa: number;
    @ApiProperty()
    numeroDeMeses: number;
    @ApiProperty()
    tipoDeTarifa: number;





}
