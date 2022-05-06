import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import BusquedaInterface from 'src/clientes/dto/busqueda.dto';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { AjustarDeudaDto } from './dto/ajustarDeudaDto';
import NewPagarDto from './dto/newPagarDto';
import PagoAnticipadoDto from './dto/pagoAnticipado.dto';
import { TransaccionesService } from './transacciones.service';
import { EliminarAdeudo } from './dto/eliminarAdeudo.dto';
import HistorialPagoDto from './dto/historialPagoDto';
import { generarPagoPersonalizadoDto } from './dto/generarPagoPersonalizadoDto';
const fs = require('fs');

@ApiTags('transacciones')
@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) { }


  @Get("/no-pagados")
  @UseGuards(AuthGuard('jwt'))
  findAllTransNoPayments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query("nombre") nombre?: string,
    @Query("apellidoP") apellidoPaterno?: string,
    @Query("apellidoM") apellidoMaterno?: string,
    @Query("calle") calle?: string,
    @Query("contrato") contrato?: string,
    @Query("colonia") colonia?: string
  ) {
    let busqueda: BusquedaInterface = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno,
      calle,
      contrato,
      colonia
    }
    return this.transaccionesService.getAllBystatus({ page, limit }, busqueda)
  }

  @Post("/pagar-anticipado")
  @UseGuards(AuthGuard('jwt'))
  pagoAnticipado(@Body() data: PagoAnticipadoDto, @Auth() us: UsuarioEntity) {
    return this.transaccionesService.pagoPorAdelantadoService(data.idCliente, data.tipoDePago, data.numeroDeMeses, us);
  }


  @Post("/historial-pago")
  historialPago(@Body() data: HistorialPagoDto) {
    return this.transaccionesService.historialPago(data);
  }



  @Post("/pago-personalizado")
  @UseGuards(AuthGuard('jwt'))
  generarPagoPersonalizado(@Body() data: generarPagoPersonalizadoDto, @Auth() us: UsuarioEntity) {
    return this.transaccionesService.generarPagoPersonalizado(data, us);
  }



  @Post("/pagar")
  @UseGuards(AuthGuard('jwt'))
  pagar(@Body() data: NewPagarDto, @Auth() us: UsuarioEntity) {
    return this.transaccionesService.newPayment(data.meses, data.cliente, data.porcentaje, us, data.comentarios);
  }

  @Post("/reajustar")
  reajustar(@Body() data: AjustarDeudaDto, @Auth() us: UsuarioEntity) {
    return this.transaccionesService.reajustar(data);
  }


  @Get("/importar")
  importDatabase() {
    return this.transaccionesService.importToDatabaseAdelantado()
  }


  @Delete("/eliminar-adeudo")
  eliminarAdeudos(@Body() data: EliminarAdeudo) {
    return this.transaccionesService.eliminarAdeudos(data)
  }


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
