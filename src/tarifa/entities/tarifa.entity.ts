import { ClienteEntity } from "src/clientes/entities/cliente.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tarifa')
export class TarifaEntity {

    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({
        nullable: false
    })
    descripcion: string;

    @Column({
        nullable: false
    })
    costo: number;

    @Column({
        nullable:false
    })
    costoAnual:number;

    @Column({
        nullable:false
    })
    costoPagoAnticipado:number;

    @OneToMany(() => ClienteEntity, cli => cli.contratante)
    clientes: ClienteEntity[];



  constructor(
    descripcion: string, 
    costo: number, 
    costoAnual: number, 
    costoPagoAnticipado: number, 
    id?: number, 
) {
    this.descripcion = descripcion
    this.costo = costo
    this.costoAnual = costoAnual
    this.costoPagoAnticipado = costoPagoAnticipado
    this.id = id
  }


}
