import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioMapper } from './utils/mapper';
import { UsuarioRepository } from './utils/repository';

@Injectable()
export class UsuariosService {

  constructor(
    private repository: UsuarioRepository,
    private mapper: UsuarioMapper
  ) { }


  async create(data: CreateUsuarioDto) {
    const newElement: UsuarioEntity = await this.repository.create(data);
    return this.mapper.entityToDto(newElement);
    }

  async findAll() {
    const data: UsuarioEntity[] = await this.repository.getAll()
    return data.map(d => this.mapper.entityToTransfer(d));
    }

  async findOne(id: number) {
    const data: UsuarioEntity = await this.repository.getById(id);
    console.log(data);
    return this.mapper.entityToDto(data);
    }

  async update(id: number, data: UpdateUsuarioDto) {
    const updateData = await this.repository.update(id, data);
    return this.mapper.entityToDto(updateData);
    }

  async remove(id: number) {
    await this.repository.delete(id);
  }
}
