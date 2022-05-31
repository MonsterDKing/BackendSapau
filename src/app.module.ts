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
import { DashboardModule } from './dashboard/dashboard.module';
import { ColoniaModule } from './colonia/colonia.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: parseInt("3306"),
      host: "167.71.248.181",
      username: "sapau",
      password: "NMVqtudf4gSJKv1EuxoI.",
      database: "sapau",
      // host: "127.0.0.1",
      // username: "root",
      // password: "desarrollo",
      // database: "sapau",
      autoLoadEntities: true,
      synchronize: true
    }), UsuariosModule,
    ClientesModule,
    AuthModule,
    TarifaModule,
    TransaccionesModule,
    CobrosModule,
    ScheduleModule.forRoot(),
    DashboardModule,
    ColoniaModule
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule { }