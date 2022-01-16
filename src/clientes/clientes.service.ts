import { Injectable } from '@nestjs/common';
import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';
import * as moment from 'moment';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEntity } from './entities/cliente.entity';
import { ClienteMapper } from './utils/mapper';
import { ClientesRepository } from './utils/repository';
import * as pug from 'pug';
import * as pdf from 'html-pdf'
import { join } from 'path';
import { TransaccionesService } from 'src/transacciones/transacciones.service';
import { TransaccionesEnum } from 'src/transacciones/enums/Transacciones.enum';
import { EstadoTransaccionEnum } from 'src/transacciones/enums/Estado.Transaccion.enum';
const fs = require('fs');

@Injectable()
export class ClientesService {


  constructor(
    private repository: ClientesRepository,
    private mapper: ClienteMapper,
    private _transaccionesService:TransaccionesService
  ) { }

  async create(data: CreateClienteDto) {
    const newElement: ClienteEntity = await this.repository.create(data);
    if(newElement){
      await this._transaccionesService.crearInstalacion(newElement,newElement.contratante);
    }
    return this.mapper.entityToDto(newElement);
  }

  async findAll() {
    const data: ClienteEntity[] = await this.repository.getAll()
    return data.map(d => this.mapper.entityToDto(d));
  }

  async findOne(id: number) {
    const data: ClienteEntity = await this.repository.getById(id);
    return this.mapper.entityToDto(data);
  }

  async update(id: number, data: UpdateClienteDto) {
    const updateData = await this.repository.update(id, data);
    return this.mapper.entityToDto(updateData);
  }

  async remove(id: number) {
    try{
      await this.repository.delete(id);
    }catch(ex){
      console.log(ex);
    }
  }

  async generateTicket(id:number) {
    const root = join(__dirname, '../../assets/pdf/ticket.pug');
    let trans = await this._transaccionesService.getTransaccionById(id);
    let fecha = new Date();
    let fechaParse = moment(fecha).locale('es-mx').format("L")
    
    const compiledFunction = pug.compileFile(root);
    const compiledContent = compiledFunction({
      fecha:fechaParse,
      nombre:`${trans.cliente.nombre} ${trans.cliente.apellidoPaterno} ${trans.cliente.apellidoPaterno}`,
      calle:trans.cliente.calle,
      colonia:trans.cliente.colonia,
      fechauno:moment(trans.fecha_creacion).locale('es-mx').format("L"),
      fechados:fechaParse,
      cantidad:trans.cliente.tarifa.costo
    });
    return pdf.create(compiledContent)
  }

  async generateContractStream(id:number) {
    const root = join(__dirname, '../../assets/pdf/contrato.pug');
    let us = await this.repository.getById(id);
    var d = new Date(us.fechaDeCreacion);
    const compiledFunction = pug.compileFile(root);
    const compiledContent = compiledFunction({
      contrato: us.contrato,
      cliente: `${us.nombre} ${us.apellidoPaterno} ${us.apellidoMaterno}`,
      calle:`${us.calle}`,
      colonia:`${us.colonia}`,
      fecha:`${d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()}`
    });
    return pdf.create(compiledContent)
  }


}
