import { ApiProperty } from "@nestjs/swagger";

export class FiltradoXlsDashboardDto {

    @ApiProperty()
    tipo: number;
    @ApiProperty()
    fechaInicio?: string;
    @ApiProperty()
    fechaFin?: string;

}
