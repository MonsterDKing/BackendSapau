import { ClienteEntity } from "src/clientes/entities/cliente.entity";
import { CobroEntity } from "src/cobros/entities/cobro.entity";
import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('transaccion')
export class TransaccionEntity {


    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({
        nullable: false,
    })
    tipo_transaccion: number;


    @CreateDateColumn()
    fecha_creacion: Date;

    @Column({
        nullable: true
    })
    fecha_pago: Date;

    @Column({
        nullable: false,
    })
    estado_transaccion: number;

    @ManyToOne(() => ClienteEntity, cliente => cliente.transacciones, { cascade: true })
    cliente: ClienteEntity;

    @Column({
        type: "int",
        default: 0
    })
    monto: number;

    @Column({
        default: 0
    })
    descuento: number;

    @Column({
        nullable: true
    })
    razon: string;


    @ManyToOne(() => UsuarioEntity, us => us.transacciones, { cascade: true })
    cobrador: UsuarioEntity;

    @ManyToOne(() => CobroEntity, ce => ce.transacciones)
    cobro: CobroEntity;


}