import { forwardRef, Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { ClienteMapper } from './utils/mapper';
import { ClientesRepository } from './utils/repository';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { TarifaModule } from 'src/tarifa/tarifa.module';
import { TarifaMapper } from 'src/tarifa/utils/mapper';
import { PDFModule } from '@t00nday/nestjs-pdf';
import { join } from 'path';
import { MomentModule } from '@ccmos/nestjs-moment';

const root = join(__dirname, '../../assets/pdf');
@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity]), UsuariosModule, TarifaModule, 
<<<<<<< HEAD
  PDFModule.register({
    view: {
      root,
      engine: 'pug',
    },
  }),
 MomentModule.forRoot({
=======
  MomentModule.forRoot({
>>>>>>> ecbd7687056ded8eff09adaa0ee86985988ecf20
    tz: 'America/Mexico_City',
  }),],
  controllers: [ClientesController],
  providers: [ClientesService, ClienteMapper, ClientesRepository,],
  exports: [ClientesService]
})
export class ClientesModule { }
