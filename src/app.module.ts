import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TarifaModule } from './tarifa/tarifa.module';
import { TransaccionesModule } from './transacciones/transacciones.module';
import { CobrosModule } from './cobros/cobros.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: parseInt("3306"),
      // host: "127.0.0.1",
      // username: "root",
      // password: "desarrollo",
      // database: "sapau",
      host: "us-cdbr-east-04.cleardb.com",
      username: "bf9b789906016e",
      password: "8ae039f6",
      database: "heroku_57847ecadbd45d9",
      autoLoadEntities: true,
      synchronize: true
    }), UsuariosModule,
    ClientesModule,
    AuthModule,
    TarifaModule,
    TransaccionesModule,
    CobrosModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule { }