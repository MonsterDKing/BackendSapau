import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { join } from 'path';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
const fs = require('fs');

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
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
