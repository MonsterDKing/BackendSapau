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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'website'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: parseInt('5432'),
      host: 'dpg-cqav6og8fa8c73atqot0-a.oregon-postgres.render.com',
      username: 'sapaubackend_l1kc_user',
      password: 'aiPcvqrs00W4C0Ecm2osA7poDhmBeAQn',
      database: 'sapaubackend_l1kc',
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    UsuariosModule,
    ClientesModule,
    AuthModule,
    TarifaModule,
    TransaccionesModule,
    CobrosModule,
    ScheduleModule.forRoot(),
    DashboardModule,
    ColoniaModule,
  ],
  exports: [CronService],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}

// postgresql://sapaubackend_l1kc_user:aiPcvqrs00W4C0Ecm2osA7poDhmBeAQn@dpg-cqav6og8fa8c73atqot0-a.oregon-postgres.render.com/sapaubackend_l1kc
