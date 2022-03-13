import { ApiProperty } from '@nestjs/swagger';

export default class PagoAnticipadoDto{

    @ApiProperty()
    idCliente: number;

    @ApiProperty()
    tipoDePago:number;

    @ApiProperty()
    numeroDeMeses:number;

}