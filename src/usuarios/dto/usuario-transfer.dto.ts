import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UpdateUsuarioDto } from './update-usuario.dto';

export class UsuarioTransferDto extends OmitType(UpdateUsuarioDto,['password',] as const) {

    
}
