
export class TransferCobroDto {

    cliente: string;
    cobrador: string;
    fechaDePago: Date;
    monto: number;
    folio: string;


    constructor(
        cliente: string,
        cobrador: string,
        fechaDePago: Date,
        monto: number,
        folio: string
    ) {
        this.cliente = cliente
        this.cobrador = cobrador
        this.fechaDePago = fechaDePago
        this.monto = monto
        this.folio = folio
    }

}
