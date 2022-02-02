import { forwardRef, Module } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { TransaccionesController } from './transacciones.controller';
import { TransaccionEntity } from './entities/transaccion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionRepository } from './utils/repository';
import TransaccionesMapper from './utils/mapper';
import { ClientesModule } from 'src/clientes/clientes.module';
import { CobrosModule } from 'src/cobros/cobros.module';

@Module({
  imports: [
    forwardRef(() => ClientesModule),
    CobrosModule,
    TypeOrmModule.forFeature([TransaccionEntity],),
  ],
  controllers: [TransaccionesController],
  providers: [TransaccionesService, TransaccionRepository, TransaccionesMapper],
  exports: [TransaccionRepository, TransaccionesService]
})
export class TransaccionesModule { }
