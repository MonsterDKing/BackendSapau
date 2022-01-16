export default class TransaccionCobroDto{

    id:number;
    cliente_nombre:string;
    cliente_apellido_materno:string;
    cliente_apellido_paterno:string;
    fecha_cobro:Date;
    fecha_pago:Date;
    estado:number;


  constructor(
    id: number, 
    cliente_nombre: string, 
    cliente_apellido_materno: string, 
    cliente_apellido_paterno: string, 
    fecha_cobro: Date, 
    fecha_pago: Date, 
    estado: number
) {
    this.id = id
    this.cliente_nombre = cliente_nombre
    this.cliente_apellido_materno = cliente_apellido_materno
    this.cliente_apellido_paterno = cliente_apellido_paterno
    this.fecha_cobro = fecha_cobro
    this.fecha_pago = fecha_pago
    this.estado = estado
  }



}