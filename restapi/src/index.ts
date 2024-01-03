import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { DataSource } from "typeorm";


const startServer = async () => {
    try {
        await AppDataSource.initialize();
        const app = express();
        
        // app.use(cors())
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use("/",router())

        app.listen(3000);
        console.log("Connected");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
};

startServer();
