import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import PagarDto from './dto/Pagardtoo';
import { TransaccionesService } from './transacciones.service';
const fs = require('fs');

@ApiTags('transacciones')
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

  @Get('/ticket-venta/:id')
  async generateTicketPdf(@Param('id') id: number, @Res() res) {
    this.transaccionesService.generateTicket(id).then((valor) => {
      const filepath = join(__dirname, '../../assets/generated/ticket.pdf');
      valor.toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });
    })
  }
}
