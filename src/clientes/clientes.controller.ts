import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { join } from 'path';
import { Auth } from 'src/auth/decorators/decorators-auth';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @Post()
  create(@Auth() data:UsuarioEntity,@Body() createClienteDto: CreateClienteDto) {
    createClienteDto.contratante = data.id;
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }

  @Get('/adeudos/:id')
  generatePdf(@Param('id') id: number, @Res() res) {
    return false;
  } 

  @Get('/generateContracts')
  generateContractPdf(@Res() res) {
    return false;
    // this.clientesService.generateContractStream("contrato.pug").then((data) => {
    //   data.subscribe((datados)=>{
    //     datados.pipe(res);
    //   })
    // })
  }
}
