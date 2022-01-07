import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { UsuarioService } from 'src/usuarios/usuarios.service';
import { JWTPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "desarrollo",
    });
  }

  async validate(payload: JWTPayload): Promise<UsuarioEntity> {
    const cliente = await this.userService.findOneEntity(payload.id);
    if (!cliente) {
      throw new UnauthorizedException();
    }
    return cliente;
  }
}