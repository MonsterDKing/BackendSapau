import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
@Entity('usuario')
export class UsuarioEntity {

    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({
        nullable: false
    })
     nombre: string;

    @Column({ type: 'varchar', length: 70 })
     email: string;

    @Column({ type: 'varchar', length: 70 })
     password: string;

    @Column({ type: 'bool' })
     activo: boolean;



    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compareSync(password, this.password);
    }

    constructor( nombre: string, email: string,password:string,activo:boolean,id?: number,) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.activo = activo;
    }

}