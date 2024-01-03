import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("User", {synchronize : true})
export class User {

    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    username: string 

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    phoneNumber: string

    @Column()
    address: string

    @Column()
    age: number

}

export default User
