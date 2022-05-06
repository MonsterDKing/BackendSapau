import { Module } from '@nestjs/common';
import { CobrosService } from './cobros.service';
import { CobrosController } from './cobros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CobroEntity } from './entities/cobro.entity';
import { CobroRepository } from './utils/repository';
import { CobroMapper } from './utils/mapper';

@Module({
  imports: [TypeOrmModule.forFeature([CobroEntity])],
  controllers: [CobrosController],
  providers: [CobrosService, CobroRepository, CobroMapper],
  exports: [CobroRepository]
})
export class CobrosModule { }
