import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ClientesModule } from '../clientes/clientes.module';
import { TransaccionesModule } from '../transacciones/transacciones.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports:[ClientesModule,TransaccionesModule,UsuariosModule]
})
export class DashboardModule {}
