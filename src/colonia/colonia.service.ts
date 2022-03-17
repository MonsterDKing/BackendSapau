import { Injectable } from '@nestjs/common';
import { CreateColoniaDto } from './dto/create-colonia.dto';
import { UpdateColoniaDto } from './dto/update-colonia.dto';
import { ColoniaRepository } from './utils/colonia.repository';
import { ColoniaMapper } from './utils/colonia.mapper';
import { ColoniaEntity } from './entities/colonia.entity';

@Injectable()
export class ColoniaService {

  constructor(private readonly coloniaRepository: ColoniaRepository, private readonly mapper:ColoniaMapper) {}

  async create(createColoniaDto: CreateColoniaDto) {
    let data =  this.mapper.dtoToEntity(createColoniaDto);
    this.coloniaRepository.create(data);
    return true;
  }

  async findAll() {
    const data: ColoniaEntity[] = await this.coloniaRepository.getAll()
    return data.map(d => this.mapper.entityToDto(d));
  }

  async findOne(id: number) {
    const data: ColoniaEntity = await this.coloniaRepository.getById(id)
    return this.mapper.entityToDto(data);
  }

  async update(id: number, updateColoniaDto: UpdateColoniaDto) {
    let data =  this.mapper.dtoToEntityUpdate(updateColoniaDto);
    this.coloniaRepository.update(id,data);
    return true;
  }

  async remove(id: number) {
    return await this.coloniaRepository.delete(id);
  }
}
