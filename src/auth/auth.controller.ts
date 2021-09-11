import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { LoginUsuarioDTO } from './login_usuario.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post("login")
  async login(@Body() loginDTO: LoginUsuarioDTO): Promise<{ authToken: string }> {
    const { email, password } = loginDTO;
    const valid = await this.authService.validateUser(email, password);
    if (!valid) {
      throw new UnauthorizedException();
    }
    return await this.authService.generateAccessToken(email);
  }

  @Get("me")
  async me(@Res() res, @Req() req) {
    const d:string = req.header('Authorization');

    if (d == undefined) {
      return res.status(400).json({
        ok: false,
      })
    }

    var a = d.split(" ");
    let usuario = await this.authService.validateToken(a[1]);

    try {
      return res.json({
        usuario
      })

    } catch (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }

    // const { email, pass } = loginDTO;
    // const valid = await this.authService.validateUser(email, pass);
    // if (!valid) {
    //   throw new UnauthorizedException();
    // }
    // return await this.authService.generateAccessToken(email);
  }
}
