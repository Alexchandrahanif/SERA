import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity(`Post`, {synchronize : true})
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    text: string

    @Column()
    like: Number
}

export default Post