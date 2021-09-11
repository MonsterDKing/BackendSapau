import { Module } from '@nestjs/common';
import { UsuarioService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioMapper } from './utils/mapper';
import { UsuarioRepository } from './utils/repository';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity]),], 
  controllers: [UsuariosController],
  providers: [UsuarioService,UsuarioMapper,UsuarioRepository],
  exports:[UsuarioService,UsuarioMapper]

})
export class UsuariosModule {}


