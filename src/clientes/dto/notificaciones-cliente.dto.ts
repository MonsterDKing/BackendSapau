import { ApiProperty } from "@nestjs/swagger";

export class NotificacionesClienteDto {

    id:number;
    contrato: string;
    nombre: string;
    apellidoMaterno: string;
    apellidoPaterno: string;
    calle: string;
    colonia: string;
    codigoPostal: string;
    localidad: string;
    tarifa: number;


  constructor(
    id: number, 
    contrato: string, 
    nombre: string, 
    apellidoMaterno: string, 
    apellidoPaterno: string, 
    calle: string, 
    colonia: string, 
    codigoPostal: string, 
    localidad: string, 
    tarifa: number
) {
    this.id = id
    this.contrato = contrato
    this.nombre = nombre
    this.apellidoMaterno = apellidoMaterno
    this.apellidoPaterno = apellidoPaterno
    this.calle = calle
    this.colonia = colonia
    this.codigoPostal = codigoPostal
    this.localidad = localidad
    this.tarifa = tarifa
  }



}
