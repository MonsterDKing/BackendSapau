import { forwardRef, Module } from '@nestjs/common';
import { TarifaService } from './tarifa.service';
import { TarifaController } from './tarifa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaEntity } from './entities/tarifa.entity';
import { TarifaRepository } from './utils/repository';
import { TarifaMapper } from './utils/mapper';
import { ClientesModule } from 'src/clientes/clientes.module';

@Module({
  imports:[TypeOrmModule.forFeature([TarifaEntity]),forwardRef(() => ClientesModule)], 
  controllers: [TarifaController],
  providers: [TarifaService,TarifaRepository,TarifaMapper],
  exports:[TarifaMapper,TarifaService,TarifaRepository]
})
export class TarifaModule {}
