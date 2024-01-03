// import * as express from "express"
// import * as bodyParser from "body-parser"
// import { Request, Response } from "express"
// import { AppDataSource } from "./data-source"
// import { Routes } from "./routes"
// import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     // create express app
//     const app = express()
//     app.use(bodyParser.json())

//     // register express routes from defined application routes
//     Routes.forEach(route => {
//         (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
//             const result = (new (route.controller as any))[route.action](req, res, next)
//             if (result instanceof Promise) {
//                 result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

//             } else if (result !== null && result !== undefined) {
//                 res.json(result)
//             }
//         })
//     })

//     // setup express app here
//     // ...


//     app.use(express.json());
//     // start express server
//     app.listen(3000)

//     // insert new users for test
//     await AppDataSource.manager.save(
//         AppDataSource.manager.create(User, {
//             username: "Alex Chandra Hanif",
//             email : "alex@gmail.com",
//             password : "12345",
//             phoneNumber : "082388197372",
//             address : "Jakarta Pusat",
//             age: 27
//         })
//     )

   

//     console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

// }).catch(error => console.log(error))




import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";

const startServer = async () => {
    try {
        await AppDataSource.initialize();

        const app = express();
        
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        Routes.forEach(route => {
            app[route.method](route.route, async (req: Request, res: Response, next: Function) => {
                const result = await (new (route.controller as any))[route.action](req, res, next);

                if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        });

        app.listen(3000);

        // await AppDataSource.manager.save(
        //     AppDataSource.manager.create(User, {
        //         username: "Alex Chandra Hanif",
        //         email: "alex@gmail.com",
        //         password: "12345",
        //         phoneNumber: "082388197372",
        //         address: "Jakarta Pusat",
        //         age: 27,
        //     })
        // );

        console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
};

startServer();
