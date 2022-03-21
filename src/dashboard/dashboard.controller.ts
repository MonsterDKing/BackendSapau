import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("dashboard")
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {  }


  @Get()
  getAll() {
    return this.dashboardService.getDashboard();
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
