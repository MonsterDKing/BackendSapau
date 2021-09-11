import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {

    @ApiProperty()
    id: number;

}
