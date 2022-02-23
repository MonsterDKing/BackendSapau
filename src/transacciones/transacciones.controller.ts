import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { AjustarDeudaDto } from './dto/ajustarDeudaDto';
import NewPagarDto from './dto/newPagarDto';
import PagarDto from './dto/Pagardtoo';
import { TransaccionesService } from './transacciones.service';
const fs = require('fs');

@ApiTags('transacciones')
@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) { }


  @Get("/no-pagados")
  @UseGuards(AuthGuard('jwt'))
  findAllTransNoPayments() {
    return this.transaccionesService.getAllBystatus()
  }

  @Post("/pagar")
  @UseGuards(AuthGuard('jwt'))
  pagar(@Body() data: NewPagarDto, @Auth() us: UsuarioEntity) {
    return this.transaccionesService.newPayment(data.meses, data.cliente, us);
  }

  @Post("/reajustar")
  reajustar(@Body() data: AjustarDeudaDto, @Auth() us: UsuarioEntity) {
    return this.transaccionesService.reajustar(data);
  }


  // // @Get("/importar")
  // // importDatabase() {
  // //   return this.transaccionesService.importToDatabase()
  // // }

  @Get('/ticket-venta/:id')
  async generateTicketPdf(@Param('id') id: number, @Res() res) {
    this.transaccionesService.newGenerateTicket(id).then((valor) => {
      const filepath = join(__dirname, '../../assets/generated/ticket.pdf');
      valor.toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });
    })
  }
}
