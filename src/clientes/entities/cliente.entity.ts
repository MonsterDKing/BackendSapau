import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('cliente')
export class ClienteEntity {

    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({
        nullable: false
    })
    contrato: string;

    @Column({
        nullable: false
    })
    nombre: string;

    @Column({
        nullable: false
    })

    apellidoMaterno: string; 
    
    @Column({
        nullable: false
    })
    apellidoPaterno: string;

    @ManyToOne(() => UsuarioEntity, us => us.clientes)
    contratante: UsuarioEntity;

    @Column({
        nullable: false
    })
    calle: string;

    @Column({
        nullable: false
    })
    colonia: string;


    @Column({
        nullable: false
    })
    codigoPostal: string;

    @Column({
        nullable: false
    })
    localidad: string;




}