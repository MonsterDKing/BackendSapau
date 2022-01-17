import { ClienteEntity } from "src/clientes/entities/cliente.entity";
import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('transaccion')
export class TransaccionEntity {


    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({
        nullable:false,
    })
    tipo_transaccion:number;


    @CreateDateColumn()
    fecha_creacion: Date;

    @Column()
    fecha_pago:Date;

    @Column({
        nullable:false,
    })
    estado_transaccion:number;

    @Column({})
    folio:string;

    @ManyToOne(() => ClienteEntity, cliente => cliente.transacciones)
    cliente:ClienteEntity;

    
    @ManyToOne(() => UsuarioEntity, us => us.transacciones)
    cobrador:UsuarioEntity;


}