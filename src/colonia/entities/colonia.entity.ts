import { ClienteEntity } from 'src/clientes/entities/cliente.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('colonia')
export class ColoniaEntity {

    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    
    @Column({
        nullable: false
    })
    nombre: string;



    @OneToMany(() => ClienteEntity, cli => cli.contratante)
    clientes: ClienteEntity[];



  constructor(nombre: string,id?: number,) {
    this.id = id
    this.nombre = nombre
  }



}
