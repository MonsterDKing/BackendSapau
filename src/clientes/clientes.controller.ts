import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { ClientesService } from './clientes.service';
import BusquedaInterface from './dto/busqueda.dto';
import { CambiarTomaDeAguaDto } from './dto/cambiar-toma-de-agua';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { GenerateMassivePdf } from './dto/generate-massive.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
const fs = require('fs');

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Auth() data: UsuarioEntity, @Body() createClienteDto: CreateClienteDto) {
    createClienteDto.contratante = data.id;
    return this.clientesService.create(createClienteDto);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get("previous-debit")
  findAllWithHavePreviousDebit(
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
    return this.clientesService.clientesPreviousDebit({
      page,
      limit,
    }, busqueda);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query("nombre") nombre?: string,
    @Query("apellidoP") apellidoPaterno?: string,
    @Query("apellidoM") apellidoMaterno?: string,
    @Query("calle") calle?: string,
    @Query("contrato") contrato?: string
  ) {
    limit = limit > 100 ? 100 : limit;
    let busqueda: BusquedaInterface = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno,
      calle,
      contrato
    }

    return this.clientesService.findAll({
      page,
      limit,
    }, busqueda);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }


  @Post('/generate-massive')
  generateMassive(@Body() data: GenerateMassivePdf, @Res() res) {
    return this.clientesService.generarNotificacionesMassivas(data.ids).then((valor)=>{
      const filepath = join(__dirname, '../../assets/generated/notificacion-masiva.pdf');
      valor.toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });

    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/cambiar-toma-agua')
  cambiarTomaDeGua(@Body() data: CambiarTomaDeAguaDto) {
    return this.clientesService.cambiarEstadoTomaAgua(data);
  }





  @Get('/notificacion-client/:id')
  async generateNotificationByClient(@Param('id') id: number, @Res() res) {
    this.clientesService.generarNotificacionByIdClient(id).then((valor) => {
      const filepath = join(__dirname, '../../assets/generated/ticket.pdf');
      valor.toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });
    })
  }


  @Get('/notificacion/:id')
  async generateTicketPdf(@Param('id') id: number, @Res() res) {
    this.clientesService.generarNotificacion(id).then((valor) => {
      const filepath = join(__dirname, '../../assets/generated/ticket.pdf');
      valor.toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });
    })
  }




  @Get('/contrato/:id')
  async generateContractPdf(@Param('id') id: number, @Res() res) {
    this.clientesService.generateContractStream(id).then((valor) => {
      const filepath = join(__dirname, '../../assets/generated/contrato.pdf');
      valor.toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });
    })
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    this.clientesService.removeClient(id);
    // return this.clientesService.remove(+id);
  }

}
