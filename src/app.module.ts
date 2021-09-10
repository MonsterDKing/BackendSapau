import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: "us-cdbr-east-04.cleardb.com",
    port: parseInt("3306"),
    username: "bf9b789906016e",
    password: "8ae039f6",
    database: "heroku_57847ecadbd45d9",
    autoLoadEntities: true,
    synchronize: true
  }),UsuariosModule, ClientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}