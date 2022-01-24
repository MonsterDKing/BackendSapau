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

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity]),
    UsuariosModule,
    TarifaModule,
    TransaccionesModule,
  MomentModule.forRoot({
    tz: 'America/Mexico_City',
  }),],
  controllers: [ClientesController],
  providers: [
    ClientesService,
    ClienteMapper,
    ClientesRepository,
  ],
  exports: [ClientesService,]
})
export class ClientesModule { }
