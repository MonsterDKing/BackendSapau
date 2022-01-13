import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
const fs = require('fs');


@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Auth() data:UsuarioEntity,@Body() createClienteDto: CreateClienteDto) {
    createClienteDto.contratante = data.id;
    return this.clientesService.create(createClienteDto);
  }

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.clientesService.findAll();
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

  @ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }

  @Get('/adeudos/:id')
  generatePdf(@Param('id') id: number, @Res() res) {
    return false;
  } 


@Get('/contrato/:id')
 async generateContractPdf(@Param('id') id: number,@Res() res) {
    this.clientesService.generateContractStream(id).then((valor)=>{
      const filepath = join(__dirname, '../../assets/generated/prueba2.pdf');
      valor.toStream(function(err, stream){
        stream.pipe(fs.createWriteStream(filepath));
        stream.pipe(res);
      });
    })
  }
}
