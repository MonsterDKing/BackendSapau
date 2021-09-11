import { Injectable } from '@nestjs/common';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { TarifaEntity } from './entities/tarifa.entity';
import { TarifaMapper } from './utils/mapper';
import { TarifaRepository } from './utils/repository';

@Injectable()
export class TarifaService {



  constructor(
    private repository: TarifaRepository,
    private mapper: TarifaMapper
  ) { }

  async create(data: CreateTarifaDto) {
    const newElement: TarifaEntity = await this.repository.create(data);
    return this.mapper.entityToDto(newElement);
    }

  async findAll() {
    const data: TarifaEntity[] = await this.repository.getAll()
    return data.map(d => this.mapper.entityToDto(d));
    }

  async findOne(id: number) {
    const data: TarifaEntity = await this.repository.getById(id);
    return this.mapper.entityToDto(data);
    }

  async update(id: number, data: UpdateTarifaDto) {
    const updateData = await this.repository.update(id, data);
    return this.mapper.entityToDto(updateData); 
   }

  async remove(id: number) {
    await this.repository.delete(id);
  }
}
