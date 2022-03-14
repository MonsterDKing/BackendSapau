import { ClienteEntity } from "src/clientes/entities/cliente.entity";
import { TransaccionEntity } from "src/transacciones/entities/transaccion.entity";
import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("cobro")
export class CobroEntity {


    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @ManyToOne(() => ClienteEntity, cliente => cliente.transacciones)
    cliente: ClienteEntity;

    @ManyToOne(() => UsuarioEntity, us => us.cobros)
    cobrador: UsuarioEntity;

    @OneToMany(() => TransaccionEntity, trans => trans.cobro)
    transacciones: TransaccionEntity[];

    @Column({
        default:0
    })
    descuento: number;

    @Column({})
    folio: string;

    @CreateDateColumn()
    fecha_creacion: Date;




}
