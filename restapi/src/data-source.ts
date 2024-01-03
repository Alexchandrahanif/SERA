import "reflect-metadata"
import { DataSource } from "typeorm"
import Entities from "./entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "SERA",
    synchronize: true,
    logging: true,
    entities: [...Object.values(Entities)],
    migrations: [],
    subscribers: [],
    migrationsTableName : "migrationSchema"
})

export default AppDataSource
