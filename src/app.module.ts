import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [UsuariosModule, ClientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
