import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TarifaModule } from './tarifa/tarifa.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    port: parseInt("3306"),
    // host: "localhost",
    // username: "root",
    // password: "desarrollo",
    // database: "sapau",
    host: "us-cdbr-east-04.cleardb.com",
    username: "bf9b789906016e",
    password: "8ae039f6",
    database: "heroku_57847ecadbd45d9",
    autoLoadEntities: true,
    synchronize: true
  }),UsuariosModule, ClientesModule, AuthModule, TarifaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}