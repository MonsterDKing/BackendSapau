import { forwardRef, Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { ClienteMapper } from './utils/mapper';
import { ClientesRepository } from './utils/repository';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { TarifaModule } from 'src/tarifa/tarifa.module';
import { MomentModule } from '@ccmos/nestjs-moment';
import { TransaccionesModule } from 'src/transacciones/transacciones.module';
import { PagoAnticipadoController } from './pago-anticipado.controller';
import { ColoniaModule } from '../colonia/colonia.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity]),
    UsuariosModule,
    TarifaModule,
    TransaccionesModule,
    ColoniaModule,
  MomentModule.forRoot({
    tz: 'America/Mexico_City',
  }),],
  controllers: [ClientesController,PagoAnticipadoController],
  providers: [
    ClientesService,
    ClienteMapper,
    ClientesRepository,
  ],
  exports: [ClientesService, ClientesRepository, ClienteMapper]
})
export class ClientesModule { }
