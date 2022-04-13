import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import FiltradoDashboardDto from './dto/filtrado.dto';

@ApiTags("dashboard")
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {  }


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




  

  @Get("/users")
  users(){
    return this.dashboardService.getUsers();
  }



  @Get("/no-pagados")
  @UseGuards(AuthGuard('jwt'))
  findAllTransNoPayments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {

    // return this.transaccionesService.getAllBystatus({page,limit}, busqueda)
  }

}
