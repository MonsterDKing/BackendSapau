import { Module } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { TransaccionesController } from './transacciones.controller';
import { TransaccionEntity } from './entities/transaccion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionRepository } from './utils/repository';

@Module({
  imports:[TypeOrmModule.forFeature([TransaccionEntity]),], 
  controllers: [TransaccionesController],
  providers: [TransaccionesService,TransaccionRepository],
  exports:[TransaccionRepository,TransaccionesService]
})
export class TransaccionesModule {}
