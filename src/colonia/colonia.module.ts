import { Module } from '@nestjs/common';
import { ColoniaService } from './colonia.service';
import { ColoniaController } from './colonia.controller';
import { ColoniaRepository } from './utils/colonia.repository';
import { ColoniaMapper } from './utils/colonia.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColoniaEntity } from './entities/colonia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColoniaEntity])],
  controllers: [ColoniaController],
  providers: [ColoniaService, ColoniaRepository, ColoniaMapper],
  exports: [ColoniaRepository]
})
export class ColoniaModule { }
