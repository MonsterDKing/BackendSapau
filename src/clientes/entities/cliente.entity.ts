import { CobroEntity } from "src/cobros/entities/cobro.entity";
import { TarifaEntity } from "src/tarifa/entities/tarifa.entity";
import { TransaccionEntity } from "src/transacciones/entities/transaccion.entity";
import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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

    @ManyToOne(() => TarifaEntity, tarifa => tarifa.clientes)
    tarifa: TarifaEntity;

    @Column({
        nullable: true
    })
    calle: string;

    @Column({
        nullable: true
    })
    colonia: string;


    @Column({
        nullable: true
    })
    codigoPostal: string;

    @Column({
        nullable: true
    })
    localidad: string;

    @OneToMany(() => TransaccionEntity, trans => trans.cliente)
    transacciones: TransaccionEntity[];

    @OneToMany(() => CobroEntity, cobro => cobro.cliente)
    cobros: CobroEntity[];

    @Column({
        default: true
    })
    mostrar: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public fechaDeCreacion: Date;



    constructor(contrato: string, nombre: string, apellidoMaterno: string, apellidoPaterno: string, contratante: UsuarioEntity, calle: string, colonia: string, codigoPostal: string, localidad: string, tarifa: TarifaEntity, id?: number) {
        this.contrato = contrato;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.contratante = contratante;
        this.calle = calle;
        this.colonia = colonia;
        this.codigoPostal = codigoPostal;
        this.localidad = localidad;
        this.tarifa = tarifa;
        this.id = id;
    }


}