import { Injectable } from '@nestjs/common';
import { TransaccionRepository } from 'src/transacciones/utils/repository';
import { ClientesRepository } from '../clientes/utils/repository';
import { DashboardDto } from './dto/dashboard.dto';
import { UsuarioRepository } from '../usuarios/utils/repository';
import { mesesUtils } from './utils/meses';
import { ColoniaRepository } from '../colonia/utils/colonia.repository';
import FiltradoDashboardDto from './dto/filtrado.dto';

@Injectable()
export class DashboardService {
    
    constructor(
        private clientesRepository: ClientesRepository,
        private transaccionRepository:TransaccionRepository,
        private usuarioRepository:UsuarioRepository,
        private coloniaRepository:ColoniaRepository

    ){}
    
    async getDashboard(){
        let dashboard = new DashboardDto();
        let c = await this.clientesRepository.getAll();
        let deudaRaw = await this.transaccionRepository.getAllDeuda();
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
        dashboard.meses = data;
        return dashboard;
    }

    async ingresosPorCobradores(filtro:FiltradoDashboardDto){
        let cobradoresConTotal = await this.usuarioRepository.getCobradoresConMonto(filtro);
        return cobradoresConTotal;
    }

    async getTransacciones(filtro:FiltradoDashboardDto){
        let cobradoresConTotal = await this.usuarioRepository.getCobradoresConMonto(filtro);
        return cobradoresConTotal;
    }

    async getMontosPorColonia(filtro:FiltradoDashboardDto){
        let colonias = await this.coloniaRepository.getAll();
        let coloniasMonto:any[] = [];
        for(let i of colonias){
            let valor = await this.coloniaRepository.getMontoByColnias(i.id,filtro);
            let monto = valor.valor ? Number(valor.valor) : 0
            coloniasMonto.push({
                nombre:i.nombre,
                valor:monto
            })
        }
        return coloniasMonto;
    }

    async getUsers(){
        return this.usuarioRepository.getAll();
    }
    

    


}
