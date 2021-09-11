import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTarifaDto } from './create-tarifa.dto';

export class UpdateTarifaDto extends PartialType(CreateTarifaDto) {
    @ApiProperty()
    id: number;

}
