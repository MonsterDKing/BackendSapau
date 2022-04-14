import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import FiltradoDashboardDto from './dto/filtrado.dto';
import { FiltradoXlsDashboardDto } from './dto/dashboard.xls.dto';
import { createReadStream } from 'fs';

@ApiTags("dashboard")
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  @Get()
  getAll() {
    return this.dashboardService.getDashboard();
  }

  @Get("/ingresos-cobradores")
  getDeuda(
    @Query("fechaInicio") fechaInicio?: string,
    @Query("fechaFin") fechaFin?: string,
  ) {
    let busqueda: FiltradoDashboardDto = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }
    return this.dashboardService.ingresosPorCobradores(busqueda);
  }

  @Get("/colonia-deuda")
  getColoniaDeuda(
    @Query("fechaInicio") fechaInicio?: string,
    @Query("fechaFin") fechaFin?: string,
  ) {
    let busqueda: FiltradoDashboardDto = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }
    return this.dashboardService.getMontosPorColonia(busqueda);
  }


  @Get("/deuda-total")
  getDeudaTotal(
    @Query("fechaInicio") fechaInicio?: string,
    @Query("fechaFin") fechaFin?: string,
  ) {
    let busqueda: FiltradoDashboardDto = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }
    return this.dashboardService.getDeudaTotal(busqueda);
  }






  @Get("/usuarios-total")
  getUsuariosTotales(
    @Query("fechaInicio") fechaInicio?: string,
    @Query("fechaFin") fechaFin?: string,
  ) {
    let busqueda: FiltradoDashboardDto = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }
    return this.dashboardService.getUsuariosTotales(busqueda);
  }


  @Get("/ultimas-transacciones")
  getUltimasTransacciones(
    @Query("fechaInicio") fechaInicio?: string,
    @Query("fechaFin") fechaFin?: string,
  ) {
    let busqueda: FiltradoDashboardDto = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }
    return this.dashboardService.getUltimasTransacciones(busqueda);
  }


  @Post("/download-transacciones")
  postXlsTransacciones(@Body() data: FiltradoXlsDashboardDto, @Res() res) {
    return this.dashboardService.generarXlsTranssaciones(data).then((val) => {
      var readStream = createReadStream(val);
      return readStream.pipe(res);
    });
  }





}
