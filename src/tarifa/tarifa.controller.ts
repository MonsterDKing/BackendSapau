import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TarifaService } from './tarifa.service';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@ApiTags('tarifa')
@Controller('tarifa')
export class TarifaController {
  constructor(private readonly tarifaService: TarifaService) {}

  @Post()
  create(@Body() createTarifaDto: CreateTarifaDto) {
    return this.tarifaService.create(createTarifaDto);
  }

  @Get()
  findAll() {
    return this.tarifaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarifaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarifaDto: UpdateTarifaDto) {
    return this.tarifaService.update(+id, updateTarifaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarifaService.remove(+id);
  }
}
