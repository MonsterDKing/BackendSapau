import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity]),], 
  controllers: [UsuariosController],
  providers: [UsuariosService]
})
export class UsuariosModule {}


