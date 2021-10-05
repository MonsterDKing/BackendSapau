import { Injectable } from '@nestjs/common';
import { PDFOptions, PDFService } from '@t00nday/nestjs-pdf';
import * as moment from 'moment';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEntity } from './entities/cliente.entity';
import { ClienteMapper } from './utils/mapper';
import { ClientesRepository } from './utils/repository';

@Injectable()
export class ClientesService {


  constructor(
    private repository: ClientesRepository,
    private mapper: ClienteMapper,
    private readonly pdfService: PDFService,
  ) { }

  async create(data: CreateClienteDto) {
    const newElement: ClienteEntity = await this.repository.create(data);
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
    await this.repository.delete(id);
  }

  async generatePDFToStream(id:number,template: string) {
    var localLocale = moment().locale("es");
    var fechaActual = localLocale.format('LL').toUpperCase();
    let opt:PDFOptions={
      locals:{
        fecha:fechaActual,
        nombre:"Pedro manuel salas galindo",
        calle:"Manuel muñiz 431",
        colonia:"Juarez",
        fechauno:moment().format('YYYY/MM/D '),
        fechados:moment().format('YYYY/MM/D '),
        cantidad:200
      }
    };
    const d = await this.pdfService.toStream(template,opt);
    return d;
  }
}
