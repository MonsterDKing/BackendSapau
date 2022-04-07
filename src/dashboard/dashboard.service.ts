import { Injectable } from '@nestjs/common';
import { TransaccionRepository } from 'src/transacciones/utils/repository';
import { ClientesRepository } from '../clientes/utils/repository';
import { DashboardDto } from './dto/dashboard.dto';
import { UsuarioRepository } from '../usuarios/utils/repository';
import { mesesUtils } from './utils/meses';

@Injectable()
export class DashboardService {
    
    constructor(
        private clientesRepository: ClientesRepository,
        private transaccionRepository:TransaccionRepository,
        private usuarioRepository:UsuarioRepository

    ){}
    
    async getDashboard(){
        let dashboard = new DashboardDto();
        let c = await this.clientesRepository.getAll();
        let deudaRaw = await this.transaccionRepository.getAllDeuda();
        let cobradoresConTotal = await this.usuarioRepository.getCobradoresConMonto();
        let m = mesesUtils;
        let data:any[] = [];
       
        for(let i of m){
            let valor = await this.transaccionRepository.getAllMonthDashboard(i.inicio,i.fin);
            data.push({
                mese:i.nombre,
                valor:valor[0].valor
            })
        }


        dashboard.deudaTotal = Number(deudaRaw.deuda);
        dashboard.clientesTotales = c.length;
        dashboard.cobradoresConTotal = cobradoresConTotal;
        dashboard.meses = data;

        return dashboard;
    }

    async getUsers(){
        return this.usuarioRepository.getAll();
    }

    


}
