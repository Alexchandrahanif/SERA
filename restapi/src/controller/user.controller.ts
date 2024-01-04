import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/user.entity'
import EmailService from "../Emailservice"

export class UserController {
  private userRepository = AppDataSource.getRepository(User)
  private emailService = new EmailService(); 

  async all(request: Request, response: Response, next: NextFunction) {
    const { page = 1, limit = 10 } = request.query
    const skip = (page - 1) * limit

    try {
      const [users, total] = await this.userRepository.findAndCount({
        skip,
        take: limit,
      })

      return response.status(200).json({
        message: 'Successfully Displaying User Data',
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      console.log(error)
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id)

      const dataUser = await this.userRepository.findOne({
        where: { id },
      })

      if (!dataUser) {
        return response.status(404).json({ error: 'User not found' })
      }

      return response.status(200).json({
        message: 'Successfully Displaying User Data',
        data: dataUser,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const { username, email, password, phoneNumber, address } = request.body

      const user = this.userRepository.create({
        username,
        email,
        password,
        phoneNumber,
        address,
      })

      const savedUser = await this.userRepository.save(user)

      return response.status(201).json({
        message: 'Registered successfully',
        data: savedUser,
      })
    } catch (error) {
      console.log(error)
    }
  }

  async edit(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id)
      const { username, email, password, phoneNumber, address } = request.body

      const existingUser = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      if (!existingUser) {
        response.status(404).json({ error: 'User not found' })
      }

      existingUser.username = username
      existingUser.email = email
      existingUser.password = password
      existingUser.phoneNumber = phoneNumber
      existingUser.address = address

      const updatedUser = await this.userRepository.save(existingUser)

      return response.status(200).json({
        message: 'Successfully Updated User Data',
        data: updatedUser,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = parseInt(request.params.id)

      const userToRemove = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      if (!userToRemove) {
        response.status(404).json({ error: 'User not found' })
      }

      await this.userRepository.remove(userToRemove)

      return response.json({ message: 'Successfully Deleting User Data' })
    } catch (error) {
      console.error(error)
    }
  }

  async sendEmail(request: Request, response: Response, next: NextFunction) {
    try {
      const { userId, message } = request.body;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      await this.emailService.sendEmail(user.email, message);

      return response.status(200).json({
        message: 'Email sent successfully',
        userEmail: user.email,
        emailMessage: message,
      });
    } catch (error) {
      console.error(error);
    }
  }
 
}
