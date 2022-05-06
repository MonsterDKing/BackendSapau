import { Injectable } from '@nestjs/common';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { CobroMapper } from './utils/mapper';
import { CobroRepository } from './utils/repository';

@Injectable()
export class CobrosService {


  constructor(
    private cobroRepository: CobroRepository,
    private mapper: CobroMapper
  ) { }


  create(createCobroDto: CreateCobroDto) {
    return 'This action adds a new cobro';
  }

  async findAll() {
    let data = await this.cobroRepository.getAll();
    return data.map((el) => this.mapper.entityToDto(el));

  }

  findOne(id: number) {
    return `This action returns a #${id} cobro`;
  }

  update(id: number, updateCobroDto: UpdateCobroDto) {
    return `This action updates a #${id} cobro`;
  }

  remove(id: number) {
    return `This action removes a #${id} cobro`;
  }
}
