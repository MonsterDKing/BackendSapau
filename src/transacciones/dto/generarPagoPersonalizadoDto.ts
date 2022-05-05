

import { ApiProperty } from "@nestjs/swagger";

export class generarPagoPersonalizadoDto {

    @ApiProperty()
    idCliente: number;
    @ApiProperty()
    accion: number;
    @ApiProperty()
    razon: string;
    @ApiProperty()
    monto: number;





}
