export class TransaccionWithMonth{

    nombre:string;
    meses:number;
    calle:string;
    colonia:string;
    deuda:number;
    costoTarifa:number;
    descripcionTarifa:string;
    clienteId:number;


  constructor(
    nombre: string, 
    meses: number, 
    calle: string, 
    colonia: string, 
    deuda: number, 
    costoTarifa: number, 
    descripcionTarifa: string, 
    clienteId: number
) {
    this.nombre = nombre
    this.meses = meses
    this.calle = calle
    this.colonia = colonia
    this.deuda = deuda
    this.costoTarifa = costoTarifa
    this.descripcionTarifa = descripcionTarifa
    this.clienteId = clienteId
  }

}