import { ApiProperty } from "@nestjs/swagger";

export class CreateClienteDto {

    id:number;

    @ApiProperty()
    contrato: string;
    @ApiProperty()
    nombre: string;
    @ApiProperty()
    apellidoMaterno: string;
    @ApiProperty()
    apellidoPaterno: string;
    // @ApiProperty()
    contratante: number;
    @ApiProperty()
    calle: string;
    @ApiProperty()
    colonia: string;
    @ApiProperty()
    codigoPostal: string;
    @ApiProperty()
    localidad: string;
    @ApiProperty()
    tarifa: number;


    constructor(contrato: string, nombre: string, apellidoPaterno: string, apellidoMaterno: string, contratante: number, calle: string, colonia: string, codigoPostal: string, localidad: string,tarifa:number,id?:number) {
        this.contrato = contrato;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.contratante = contratante;
        this.calle = calle;
        this.colonia = colonia;
        this.codigoPostal = codigoPostal;
        this.localidad = localidad;
        this.tarifa = tarifa
        this.id = id;
    }



}
