import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
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

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query("nombre") nombre?: string
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.clientesService.findAll({
      page,
      limit,
    }, nombre);
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

  @Get('/ticket/:id')
  async generateTicketPdf(@Param('id') id: number, @Res() res) {
    this.clientesService.generateTicket(id).then((valor) => {
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
    console.log("ssss")
    console.log(id);
    return this.clientesService.remove(+id);
  }

}
