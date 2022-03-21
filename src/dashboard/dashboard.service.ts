import { Injectable } from '@nestjs/common';
import { TransaccionRepository } from 'src/transacciones/utils/repository';
import { ClientesRepository } from '../clientes/utils/repository';
import { DashboardDto } from './dto/dashboard.dto';
import { UsuarioRepository } from '../usuarios/utils/repository';

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
        
        dashboard.deudaTotal = Number(deudaRaw.deuda);
        dashboard.clientesTotales = c.length;
        return dashboard;
    }

    async getUsers(){
        return this.usuarioRepository.getAll();
    }



}
