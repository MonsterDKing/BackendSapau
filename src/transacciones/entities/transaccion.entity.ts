import { ClienteEntity } from "src/clientes/entities/cliente.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('transaccion')
export class TransaccionEntity {


    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({
        nullable:false,
    })
    tipo_transaccion:number;

    @ManyToOne(() => ClienteEntity, cliente => cliente.transacciones)
    cliente:ClienteEntity;

    @CreateDateColumn()
    fecha_creacion: Date;



}