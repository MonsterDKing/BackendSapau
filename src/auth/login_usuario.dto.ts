import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

