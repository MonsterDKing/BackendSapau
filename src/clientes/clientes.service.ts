import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEntity } from './entities/cliente.entity';
import { ClienteMapper } from './utils/mapper';
import { ClientesRepository } from './utils/repository';
import { TransaccionesService } from 'src/transacciones/transacciones.service';
import { join } from 'path';

import * as moment from 'moment';
import * as pug from 'pug';
import * as pdf from 'html-pdf'
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import BusquedaInterface from './dto/busqueda.dto';
import { SendClientDto } from './dto/SendClientDto';


const fs = require('fs').promises;
@Injectable()
export class ClientesService {


  constructor(
    private repository: ClientesRepository,
    private mapper: ClienteMapper,
    private _transaccionesService: TransaccionesService
  ) { }

  async create(data: CreateClienteDto) {
    const newElement: ClienteEntity = await this.repository.create(data);
    if (newElement) {
      await this._transaccionesService.crearInstalacion(newElement, newElement.contratante);
    }
    return this.mapper.entityToDto(newElement);
  }

  async findAll(options: IPaginationOptions, nombre?: BusquedaInterface) {
    const paginationObject = await this.repository.getAllPaginate(options, nombre);
    return new Pagination<SendClientDto>(
      paginationObject.items.map((clientes) => this.mapper.entityToSendClientDto(clientes)),
      paginationObject.meta
    )
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
    try {
      await this.repository.delete(id);
    } catch (ex) {
      console.log(ex);
    }
  }

  async removeClient(id: number) {
    try {
      this.repository.hideClient(id)
    } catch (ex) {
      console.log(ex);
    }
  }

  async generarNotificacionesMassivas(ids: number[]) {
    let compile = "";
    for (let i of ids) {
      const root = join(__dirname, '../../assets/pdf/ticket.pug');
      let cliente = await this.repository.getByIdWithTransactions(i);
      let total = 0;
      cliente.transacciones.forEach((el) => {
        total += el.monto;
      })
      let fecha = new Date();
      let fechaParse = moment(fecha).locale('es-mx').format("L")
      const logoBase64 = await fs.readFile(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });
      const compiledFunction = pug.compileFile(root);
      const compiledContent = compiledFunction({
        logo: logoBase64,
        fecha: fechaParse,
        nombre: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
        calle: cliente.calle,
        colonia: cliente.colonia,
        fechauno: moment(cliente.transacciones[0].fecha_creacion).locale('es-mx').format("L"),
        fechados: fechaParse,
        cantidad: total
      });
      compile = compile + compiledContent;
    }
    return pdf.create(compile);
  }


  async generarNotificacionByIdClient(id: number) {
    const root = join(__dirname, '../../assets/pdf/ticket.pug');
    let cliente = await this.repository.getByIdWithTransactions(id);
    let total = 0;
    cliente.transacciones.forEach((el) => {
      total += el.monto;
    })
    let fecha = new Date();
    let fechauno = moment(cliente.transacciones[0].fecha_creacion).locale('es-mx').format("MMM YYYY");
    let fechaParse = moment(fecha).locale('es-mx').format("MMM YYYY")
    const logoBase64 = await fs.readFile(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });
    const compiledFunction = pug.compileFile(root);
    const compiledContent = compiledFunction({
      logo: logoBase64,
      fecha: fechaParse,
      nombre: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
      calle: cliente.calle,
      colonia: cliente.colonia.nombre,
      fechauno: fechauno,
      fechados: fechaParse,
      cantidad: total
    });
    return pdf.create(compiledContent)
  }

  async generarNotificacion(id: number) {
    const root = join(__dirname, '../../assets/pdf/ticket.pug');
    let trans = await this._transaccionesService.getTransaccionById(id);
    let fecha = new Date();
    let fechaParse = moment(fecha).locale('es-mx').format("L")
    const logoBase64 = await fs.readFile(join(__dirname, '../../assets/pdf/logo.png'), { encoding: 'base64' });
    const compiledFunction = pug.compileFile(root);
    const compiledContent = compiledFunction({
      logo: logoBase64,
      fecha: fechaParse,
      nombre: `${trans.cliente.nombre} ${trans.cliente.apellidoPaterno} ${trans.cliente.apellidoMaterno}`,
      calle: trans.cliente.calle,
      colonia: trans.cliente.colonia,
      fechauno: moment(trans.fecha_creacion).locale('es-mx').format("L"),
      fechados: fechaParse,
      cantidad: trans.cliente.tarifa.costo
    });
    return pdf.create(compiledContent)
  }

  async generateContractStream(id: number) {
    const root = join(__dirname, '../../assets/pdf/contrato.pug');
    let us = await this.repository.getById(id);
    var d = new Date(us.fechaDeCreacion);
    const compiledFunction = pug.compileFile(root);
    const compiledContent = compiledFunction({
      contrato: us.contrato,
      cliente: `${us.nombre} ${us.apellidoPaterno} ${us.apellidoMaterno}`,
      calle: `${us.calle}`,
      colonia: `${us.colonia.nombre}`,
      fecha: `${d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()}`
    });

    return pdf.create(compiledContent)
  }

  //PagoAnticipado
  async findAllClientsPagoAnticipado(options: IPaginationOptions, busqueda?: BusquedaInterface) {
    const paginationObject = await this.repository.getAllPaginateAndDontHavePreviousDebit(options, busqueda);
    return new Pagination<CreateClienteDto>(
      paginationObject.items.map((clientes) => this.mapper.entityToNotificationDto(clientes)),
      paginationObject.meta
    )
  }



  async clientesPreviousDebit(options: IPaginationOptions, busqueda?: BusquedaInterface,) {
    const paginationObject = await this.repository.getAllPaginateAndHavePreviousDebit(options, busqueda);
    return new Pagination<CreateClienteDto>(
      paginationObject.items.map((clientes) => this.mapper.entityToNotificationDto(clientes)),
      paginationObject.meta
    )
  }
}


