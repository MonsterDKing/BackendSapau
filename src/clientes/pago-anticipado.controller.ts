import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { ClientesService } from './clientes.service';
import BusquedaInterface from './dto/busqueda.dto';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
const fs = require('fs');

@ApiTags('pago-anticipado')
@Controller('pago-anticipado')
export class PagoAnticipadoController {
  constructor(private readonly clientesService: ClientesService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get("/clientes")
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query("nombre") nombre?: string,
    @Query("apellidoP") apellidoPaterno?: string,
    @Query("apellidoM") apellidoMaterno?: string,
    @Query("calle") calle?: string,
    @Query("contrato") contrato?: string,
    @Query("colonia") colonia?: string
  ) {
    limit = limit > 100 ? 100 : limit;
    let busqueda: BusquedaInterface = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno,
      calle,
      contrato,
      colonia
    }
    return this.clientesService.findAllClientsPagoAnticipado({
      page,
      limit,
    }, busqueda);
  }

}
