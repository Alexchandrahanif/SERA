import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/user.entity"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        const { page = 1, limit = 10 } = request.query;
        const skip = (page - 1) * limit;
    
        try {
          const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
          });
    
          response.status(200).json({
            message : "Successfully Displaying User Data",
            data : users,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
          });
        } catch (error) {
          next(error);
        }
      }

      async one(request: Request, response: Response, next: NextFunction) {
        try {
          const id = parseInt(request.params.id);
      
          const dataUser = await this.userRepository.findOne({
            where: { id }
          });
      
          if (!dataUser) {
            return response.status(404).json({ error: "User not found" });
          }
      
          return response.status(200).json({
            message : "Successfully Displaying User Data",
            data : dataUser
          });
        } catch (error) {
          console.error("Error in 'one' method:", error);
          return response.status(500).json({ error: "Internal Server Error" });
        }
      }
      

      async save(request: Request, response: Response, next: NextFunction) {
        try {
          const { username, email, password, phoneNumber, address } = request.body;
      
          const user = this.userRepository.create({
            username,
            email,
            password,
            phoneNumber,
            address,
          });
      
          const savedUser = await this.userRepository.save(user);
      
          return response.status(201).json({
            message : "Registered successfully",
            data : savedUser
          }); 
        } catch (error) {
          return response.status(500).json({ error: "Internal Server Error" });
        }
      }

      async edit(request: Request, response: Response, next: NextFunction) {
        try {
          const id = parseInt(request.params.id);
          const { username, email, password, phoneNumber, address } = request.body;
      
          const existingUser = await this.userRepository.findOne({
            where : {
              id
            }
          });
      
          if (!existingUser) {
            return response.status(404).json({ error: "User not found" });
          }
      
          existingUser.username = username;
          existingUser.email = email;
          existingUser.password = password;
          existingUser.phoneNumber = phoneNumber;
          existingUser.address = address;
      
          const updatedUser = await this.userRepository.save(existingUser);
      
          return response.status(200).json({
            message : "Successfully Updated User Data",
            data : updatedUser
          });
        } catch (error) {
          console.error("Error in 'edit' method:", error);
          return response.status(500).json({ error: "Internal Server Error" });
        }
      }
      
      

      async remove(request: Request, response: Response, next: NextFunction) {
        try {
          const id = parseInt(request.params.id);
      
          const userToRemove = await this.userRepository.findOne({
            where : {
              id
            }
          });
      
          if (!userToRemove) {
            return response.status(404).json({ error: "User not found" });
          }
      
          await this.userRepository.remove(userToRemove);
      
          return response.json({ message: "Successfully Deleting User Data" });
        } catch (error) {
          console.error("Error in 'remove' method:", error);
          return response.status(500).json({ error: "Internal Server Error" });
        }
      }
      

}