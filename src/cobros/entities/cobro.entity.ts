import { ClienteEntity } from "src/clientes/entities/cliente.entity";
import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("cobro")
export class CobroEntity {

    
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @ManyToOne(() => ClienteEntity, cliente => cliente.transacciones)
    cliente:ClienteEntity;

    @ManyToOne(() => UsuarioEntity, us => us.cobros)
    cobrador:UsuarioEntity;

    @CreateDateColumn()
    fecha_creacion: Date;



}
