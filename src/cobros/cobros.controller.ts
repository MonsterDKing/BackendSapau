import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CobrosService } from './cobros.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';


@ApiTags('cobros')
@Controller('cobros')
export class CobrosController {
  constructor(private readonly cobrosService: CobrosService) {}

  @Post()
  create(@Body() createCobroDto: CreateCobroDto) {
    return this.cobrosService.create(createCobroDto);
  }

  @Get()
  findAll() {
    return this.cobrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cobrosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCobroDto: UpdateCobroDto) {
    return this.cobrosService.update(+id, updateCobroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cobrosService.remove(+id);
  }
}
