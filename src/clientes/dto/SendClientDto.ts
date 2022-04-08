
export class SendClientDto {

    id:number;
    contrato: string;
    nombre: string;
    apellidoMaterno: string;
    apellidoPaterno: string;
    contratante: number;
    calle: string;
    colonia: string;
    codigoPostal: string;
    localidad: string;
    tarifa: number;
    ultimaFechaDePago:Date;
    toma_cancelada:boolean;



  constructor(
    id: number, 
    contrato: string, 
    nombre: string, 
    apellidoMaterno: string, 
    apellidoPaterno: string, 
    contratante: number, 
    calle: string, 
    colonia: string, 
    codigoPostal: string, 
    localidad: string, 
    tarifa: number, 
    ultimaFechaDePago: Date,
    toma_cancelada:boolean
) {
    this.id = id
    this.contrato = contrato
    this.nombre = nombre
    this.apellidoMaterno = apellidoMaterno
    this.apellidoPaterno = apellidoPaterno
    this.contratante = contratante
    this.calle = calle
    this.colonia = colonia
    this.codigoPostal = codigoPostal
    this.localidad = localidad
    this.tarifa = tarifa
    this.ultimaFechaDePago = ultimaFechaDePago
    this.toma_cancelada = toma_cancelada
  }



}
