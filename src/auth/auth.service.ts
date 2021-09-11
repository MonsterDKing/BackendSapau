import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuarios/usuarios.service';
import { UsuarioMapper } from 'src/usuarios/utils/mapper';
import { JWTPayload } from './jwt.payload';

@Injectable()
export class AuthService {

  constructor(
    private usService: UsuarioService,
    private jwtService: JwtService,
    private mapper: UsuarioMapper
  ) {}

  async validateUser(username: string, pass: string): Promise<boolean> {
    const user = await this.usService.getByEmail(username);
    if(user == undefined){
      return null;
    }
    return await user.validatePassword(pass);
  }

  async validateToken(token: string): Promise<boolean> {
    var a = await this.jwtService.verifyAsync(token);
    return a;
  }

  async generateAccessToken(email: string) {
    const user = await this.usService.getByEmail(email);    
    let d = await this.mapper.entityToTransfer(user);

    const payload: JWTPayload = { id: user.id,email:user.email,nombre:user.nombre };
    return {
      user:d,
      authToken: this.jwtService.sign(payload),
    };
  }

  
}
