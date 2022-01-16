import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import PagarDto from './dto/Pagardtoo';
import { TransaccionesService } from './transacciones.service';


@ApiTags('cobrar')
@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  
  @Get("/no-pagados")
  findAllTransNoPayments(){
    return this.transaccionesService.getAllBystatus()
  }

  @Post("/pagar")
  pagar(@Body() data:PagarDto,@Auth() us: UsuarioEntity){
    return this.transaccionesService.pagar(data.idtransaccion,us);
  }
}
